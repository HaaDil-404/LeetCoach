const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Initialize Gemini ──
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env file to enable AI features."
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

/**
 * Safely parse JSON from Gemini's response, stripping markdown fences if present.
 */
const parseJSON = (text) => {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned);
};

// ─────────────────────────────────────────────────────────────
//  1. AI Hint Generator
// ─────────────────────────────────────────────────────────────
const generateHints = async (problemDescription, difficulty) => {
  const model = getModel();

  const prompt = `You are LeetCoach AI, a coding interview tutor. A student is working on a ${difficulty} problem and needs hints.

Problem Description:
${problemDescription}

Generate exactly 3 progressive hints that gradually guide the student toward the solution WITHOUT revealing the full answer.

Rules:
- Hint 1: A gentle conceptual nudge — mention the general approach or data structure category to consider. Keep it vague and encouraging.
- Hint 2: A more specific algorithmic direction — mention the specific technique, pattern, or key insight needed. Give a concrete direction.
- Hint 3: Detailed pseudocode-level guidance — walk through the key steps of the algorithm, but do NOT write actual working code. Leave some gaps for the student to fill.
- Never reveal the complete solution.
- Tailor hint complexity to the ${difficulty} level.

Respond ONLY with valid JSON in this exact format:
{
  "hint1": "...",
  "hint2": "...",
  "hint3": "..."
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return parseJSON(response);
};

// ─────────────────────────────────────────────────────────────
//  2. AI Solution Explainer
// ─────────────────────────────────────────────────────────────
const explainSolution = async (problemDescription, difficulty) => {
  const model = getModel();

  const prompt = `You are LeetCoach AI, an expert coding interview tutor. Explain the optimal solution for this ${difficulty} problem.

Problem Description:
${problemDescription}

Provide a comprehensive explanation with these four sections:

1. **Beginner Explanation**: Explain like the student is a complete beginner. Use simple analogies, real-world comparisons, and avoid jargon. Walk through the intuition step by step.

2. **Detailed Explanation**: A thorough technical walkthrough. Explain the algorithm choice, why it works, edge cases to handle, and provide a clean implementation walkthrough with key code patterns (you can include short code snippets here).

3. **Time Complexity**: State the Big-O time complexity with a clear explanation of WHY it has this complexity. Mention best/worst/average cases if relevant.

4. **Space Complexity**: State the Big-O space complexity with an explanation of what data structures use the extra space, and whether the solution can be optimized.

Respond ONLY with valid JSON in this exact format:
{
  "beginnerExplanation": "...",
  "detailedExplanation": "...",
  "timeComplexity": "...",
  "spaceComplexity": "..."
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return parseJSON(response);
};

// ─────────────────────────────────────────────────────────────
//  3. AI Tutor Chat
// ─────────────────────────────────────────────────────────────
const tutorChat = async (topic, question) => {
  const model = getModel();

  const prompt = `You are LeetCoach AI, a friendly and expert Data Structures & Algorithms tutor. A student is asking about "${topic}".

Student's Question:
${question}

Instructions:
- Provide a clear, educational response that helps the student deeply understand the concept.
- Use real-world analogies where helpful.
- Include a simple code example (in JavaScript or Python) if it helps illustrate the concept.
- Mention time and space complexity when relevant.
- If the question is vague, interpret it in the most useful way and provide a comprehensive answer.
- Structure your response with clear sections using markdown headings (##).
- Keep the tone encouraging and supportive.
- Format code blocks with the appropriate language identifier.

Respond ONLY with valid JSON in this exact format:
{
  "response": "Your full markdown-formatted response here"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return parseJSON(response);
};

// ─────────────────────────────────────────────────────────────
//  4. AI Code Review
// ─────────────────────────────────────────────────────────────
const reviewCode = async (code, problemDescription) => {
  const model = getModel();

  const problemContext = problemDescription
    ? `\nProblem Context:\n${problemDescription}`
    : "";

  const prompt = `You are LeetCoach AI, a senior software engineer and coding interview expert. Review the following code submission.
${problemContext}

Code to Review:
\`\`\`
${code}
\`\`\`

Analyze the code thoroughly and provide:

1. **Logic Analysis**: Is the logic correct? Does it handle all cases? Explain any logical flaws or correctness issues.

2. **Time Complexity**: What is the Big-O time complexity? Is it optimal for this problem? Explain.

3. **Space Complexity**: What is the Big-O space complexity? Can it be reduced?

4. **Bugs**: List any bugs, edge case failures, off-by-one errors, null/undefined issues, or potential runtime errors. If there are no bugs, say so.

5. **Optimizations**: Suggest specific improvements — better algorithms, cleaner patterns, reduced complexity, or more idiomatic code. Include short code snippets for key suggestions.

6. **Overall Score**: Rate the code from 1-10 with a brief justification.

Respond ONLY with valid JSON in this exact format:
{
  "logic": "...",
  "timeComplexity": "...",
  "spaceComplexity": "...",
  "bugs": "...",
  "optimizations": "...",
  "score": 7,
  "summary": "Brief one-line summary of the review"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return parseJSON(response);
};

module.exports = {
  generateHints,
  explainSolution,
  tutorChat,
  reviewCode,
};
