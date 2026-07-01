#!/usr/bin/env node
/**
 * initRAG.js — Standalone script to pre-warm the RAG vector store.
 *
 * Run with:  node scripts/initRAG.js
 *
 * This is useful for:
 *  - Validating that knowledge files are loading correctly
 *  - Pre-warming the vector store before the server starts
 *  - Debugging embedding / ChromaDB issues
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { initializeVectorStore, getRAGStatus } = require("../services/ragService");

(async () => {
  console.log("═══════════════════════════════════════════════════");
  console.log("  LeetCoach AI — RAG Knowledge Base Initializer");
  console.log("═══════════════════════════════════════════════════\n");

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.error("❌ GEMINI_API_KEY is not set in .env file");
    console.error("   Please add your Gemini API key to server/.env");
    process.exit(1);
  }

  try {
    await initializeVectorStore();
    const status = getRAGStatus();

    console.log("\n📊 RAG Status:");
    console.log(`   Initialized  : ${status.initialized ? "✅ Yes" : "❌ No"}`);
    console.log(`   Chunks stored: ${status.documentCount}`);
    console.log(`   Knowledge files: ${status.knowledgeFiles}`);

    if (status.topicNames && status.topicNames.length > 0) {
      console.log("\n📚 Topics loaded:");
      status.topicNames.forEach((t) => console.log(`   • ${t}`));
    }

    console.log("\n✅ RAG Knowledge Base is ready!\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ RAG initialization failed:");
    console.error("   ", err.message);
    if (process.env.NODE_ENV === "development") {
      console.error("\nStack trace:");
      console.error(err.stack);
    }
    process.exit(1);
  }
})();
