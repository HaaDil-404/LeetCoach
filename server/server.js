const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------- Routes ---------------
app.get("/", (req, res) => {
  res.json({
    message: "🚀 LeetCoach AI API is running",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      challenges: "/api/challenges",
      ai: "/api/ai",
    },
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 LeetCoach AI Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   http://localhost:${PORT}`);

  // Initialize RAG knowledge base in the background (lazy — non-blocking)
  try {
    const { initializeVectorStore } = require("./services/ragService");
    await initializeVectorStore();
  } catch (err) {
    console.warn(
      `   ⚠️  RAG initialization deferred: ${err.message}`
    );
    console.warn(
      "   RAG will auto-initialize on first /api/ai/ask request.\n"
    );
  }
});
