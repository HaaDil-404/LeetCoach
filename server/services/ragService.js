const { GoogleGenerativeAI } = require("@google/generative-ai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const {
  GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");
const fs = require("fs");
const path = require("path");

// ── Singleton state ──
let vectorStore = null;
let isInitializing = false;
let initError = null;
let documentCount = 0;

const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");
const COLLECTION_NAME = "leetcoach_knowledge";

// ─────────────────────────────────────────────────────────────
//  1. Document Loader — reads all .txt files from knowledge/
// ─────────────────────────────────────────────────────────────
const loadDocuments = () => {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    throw new Error(
      `Knowledge directory not found at: ${KNOWLEDGE_DIR}`
    );
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".txt"));

  if (files.length === 0) {
    throw new Error(
      "No .txt files found in knowledge/ directory. Add study notes to enable RAG."
    );
  }

  const documents = files.map((file) => {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const topic = path.basename(file, ".txt").replace(/-/g, " ");
    return {
      pageContent: content,
      metadata: {
        source: file,
        topic,
      },
    };
  });

  console.log(`   📄 Loaded ${documents.length} knowledge documents`);
  return documents;
};

// ─────────────────────────────────────────────────────────────
//  2. Text Splitter — chunk documents for better retrieval
// ─────────────────────────────────────────────────────────────
const splitDocuments = async (documents) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: [
      "\n═══════════════════════════════════════════════════════",
      "\n\n",
      "\n",
      " ",
    ],
  });

  const chunks = [];
  for (const doc of documents) {
    const splits = await splitter.createDocuments(
      [doc.pageContent],
      [doc.metadata]
    );
    chunks.push(...splits);
  }

  console.log(`   ✂️  Split into ${chunks.length} chunks`);
  return chunks;
};

// ─────────────────────────────────────────────────────────────
//  3. Embedding Creation — Google text-embedding-004
// ─────────────────────────────────────────────────────────────
const getEmbeddings = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Required for embedding generation."
    );
  }
  return new GoogleGenerativeAIEmbeddings({
    apiKey,
    modelName: "text-embedding-004",
  });
};

// ─────────────────────────────────────────────────────────────
//  4. ChromaDB Storage — embed & store vectors (in-process)
// ─────────────────────────────────────────────────────────────
const initializeVectorStore = async () => {
  if (vectorStore) return vectorStore;

  // Guard against concurrent initialization
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (vectorStore) return vectorStore;
    if (initError) throw initError;
  }

  isInitializing = true;
  initError = null;

  try {
    console.log("\n🧠 Initializing RAG Knowledge Base...");

    const embeddings = getEmbeddings();
    const documents = loadDocuments();
    const chunks = await splitDocuments(documents);

    // ChromaDB in-process ephemeral store (no external server needed)
    vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
      collectionName: COLLECTION_NAME,
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
    });

    documentCount = chunks.length;
    console.log(
      `   ✅ RAG initialized! ${documentCount} chunks embedded & stored in ChromaDB\n`
    );

    return vectorStore;
  } catch (error) {
    initError = error;
    vectorStore = null;
    console.error("   ❌ RAG initialization failed:", error.message);
    throw error;
  } finally {
    isInitializing = false;
  }
};

// ─────────────────────────────────────────────────────────────
//  5. Retriever Pipeline — search → build context → generate
// ─────────────────────────────────────────────────────────────
const queryRAG = async (question) => {
  // Step 1: Ensure vector store is ready
  const store = await initializeVectorStore();

  // Step 2: Retrieve top-5 relevant chunks via cosine similarity
  const relevantDocs = await store.similaritySearch(question, 5);

  if (relevantDocs.length === 0) {
    return {
      answer:
        "I couldn't find relevant information in the knowledge base for your question. Try rephrasing or ask about a specific DSA topic like arrays, binary search, or dynamic programming.",
      sources: [],
    };
  }

  // Step 3: Build context from retrieved documents
  const context = relevantDocs
    .map(
      (doc) =>
        `[Source: ${doc.metadata.topic || doc.metadata.source}]\n${doc.pageContent}`
    )
    .join("\n\n---\n\n");

  // Extract unique sources for citation
  const sources = [
    ...new Set(
      relevantDocs.map((doc) => doc.metadata.topic || doc.metadata.source)
    ),
  ];

  // Step 4: Build RAG-augmented prompt
  const prompt = `You are LeetCoach AI, an expert Data Structures & Algorithms tutor. Answer the student's question using the context provided from your knowledge base.

CONTEXT FROM KNOWLEDGE BASE:
${context}

STUDENT'S QUESTION:
${question}

INSTRUCTIONS:
- Use the context above as your primary source of information.
- Provide a clear, educational, and thorough response.
- Include code examples (JavaScript or Python) when helpful.
- Reference specific patterns, techniques, or templates from the context.
- Use markdown formatting with headings (##), bullet points, code blocks (\`\`\`), and **bold** for emphasis.
- If the context doesn't fully cover the question, supplement with your general knowledge but prioritize the context.
- Keep the tone encouraging and supportive.
- Structure the answer with clear sections.

Respond ONLY with valid JSON in this exact format:
{
  "answer": "Your full markdown-formatted response here",
  "sources": ${JSON.stringify(sources)}
}`;

  // Step 5: Send augmented prompt to Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Strip markdown code fences if Gemini wraps JSON in them
  const cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Graceful fallback if JSON parsing fails
    return {
      answer: cleaned,
      sources,
    };
  }
};

// ─────────────────────────────────────────────────────────────
//  RAG Status — health check for the vector store
// ─────────────────────────────────────────────────────────────
const getRAGStatus = () => {
  let knowledgeFiles = 0;
  let topicNames = [];

  try {
    const files = fs
      .readdirSync(KNOWLEDGE_DIR)
      .filter((f) => f.endsWith(".txt"));
    knowledgeFiles = files.length;
    topicNames = files.map((f) =>
      path.basename(f, ".txt").replace(/-/g, " ")
    );
  } catch {
    // Directory might not exist yet
  }

  return {
    initialized: vectorStore !== null,
    initializing: isInitializing,
    documentCount,
    knowledgeFiles,
    topicNames,
    error: initError ? initError.message : null,
  };
};

module.exports = {
  queryRAG,
  getRAGStatus,
  initializeVectorStore,
};
