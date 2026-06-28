import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Lightbulb,
  BookOpen,
  MessageSquare,
  SearchCode,
  Loader2,
  ChevronDown,
  ChevronRight,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { aiAPI } from "../api";

// ── Tab Configuration ──
const tabs = [
  { id: "hints", label: "Hints", icon: Lightbulb, color: "text-accent" },
  { id: "explain", label: "Explainer", icon: BookOpen, color: "text-easy" },
  { id: "tutor", label: "Tutor", icon: MessageSquare, color: "text-medium" },
  { id: "review", label: "Code Review", icon: SearchCode, color: "text-hard" },
];

const difficulties = ["Easy", "Medium", "Hard"];

const tutorTopics = [
  "Binary Search",
  "Hash Maps",
  "Graphs",
  "Dynamic Programming",
  "Arrays & Strings",
  "Trees",
  "Linked Lists",
  "Sorting",
  "Stacks & Queues",
  "Recursion",
];

const difficultyColors = {
  Easy: {
    active: "bg-easy text-bg-primary",
    inactive: "bg-easy/10 text-easy border border-easy/20",
  },
  Medium: {
    active: "bg-medium text-bg-primary",
    inactive: "bg-medium/10 text-medium border border-medium/20",
  },
  Hard: {
    active: "bg-hard text-bg-primary",
    inactive: "bg-hard/10 text-hard border border-hard/20",
  },
};

// ── Markdown-lite renderer for AI responses ──
function RenderContent({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = "";

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="bg-bg-input border border-border rounded-lg p-4 my-3 overflow-x-auto text-xs font-[JetBrains_Mono] text-text-secondary"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-text-primary mt-4 mb-2">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-text-primary mt-3 mb-1">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2 my-0.5">
          <span className="text-accent mt-1">•</span>
          <span className="text-sm text-text-secondary leading-relaxed">
            {formatInlineCode(line.slice(2))}
          </span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-text-secondary leading-relaxed my-1">
          {formatInlineCode(line)}
        </p>
      );
    }
  });

  return <div>{elements}</div>;
}

function formatInlineCode(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-xs font-[JetBrains_Mono]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Handle bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith("**") && bp.endsWith("**")) {
        return (
          <strong key={`${i}-${j}`} className="text-text-primary font-semibold">
            {bp.slice(2, -2)}
          </strong>
        );
      }
      return bp;
    });
  });
}

// ── Typing indicator ──
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 p-6">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-accent"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted">LeetCoach AI is thinking...</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HINT GENERATOR TAB
// ═══════════════════════════════════════════════════════════════
function HintsTab() {
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [hints, setHints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealedHints, setRevealedHints] = useState([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    setHints(null);
    setRevealedHints([]);
    try {
      const res = await aiAPI.getHints({
        problemDescription: description,
        difficulty,
      });
      setHints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate hints");
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = (idx) => {
    setRevealedHints((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const hintEntries = hints
    ? [
        { label: "Hint 1 — Conceptual Nudge", text: hints.hint1, color: "easy" },
        { label: "Hint 2 — Algorithmic Direction", text: hints.hint2, color: "medium" },
        { label: "Hint 3 — Detailed Guidance", text: hints.hint3, color: "hard" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="glass-card p-6">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
          Problem Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the problem description here..."
          rows={5}
          className="w-full bg-bg-input border border-border rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent/40 transition-colors"
        />

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  difficulty === d
                    ? difficultyColors[d].active
                    : difficultyColors[d].inactive
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="ml-auto px-6 py-2.5 rounded-xl bg-accent text-bg-primary font-semibold text-sm flex items-center gap-2 hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4" />
            )}
            {loading ? "Generating..." : "Get Hints"}
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-hard/10 border border-hard/20 text-hard text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-card">
          <TypingIndicator />
        </div>
      )}

      {/* Hints Output */}
      {hints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {hintEntries.map((hint, idx) => {
            const isRevealed = revealedHints.includes(idx);
            const colorMap = {
              easy: { border: "border-easy/20", bg: "bg-easy/5", text: "text-easy", dot: "bg-easy" },
              medium: { border: "border-medium/20", bg: "bg-medium/5", text: "text-medium", dot: "bg-medium" },
              hard: { border: "border-hard/20", bg: "bg-hard/5", text: "text-hard", dot: "bg-hard" },
            };
            const c = colorMap[hint.color];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`glass-card border ${c.border} overflow-hidden`}
              >
                <button
                  onClick={() => toggleHint(idx)}
                  className={`w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:${c.bg} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`text-sm font-semibold ${c.text}`}>
                      {hint.label}
                    </span>
                  </div>
                  {isRevealed ? (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-5 pt-0 ${c.bg} border-t ${c.border}`}>
                        <RenderContent text={hint.text} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SOLUTION EXPLAINER TAB
// ═══════════════════════════════════════════════════════════════
function ExplainTab() {
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("beginner");
  const [error, setError] = useState("");

  const handleExplain = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    setExplanation(null);
    try {
      const res = await aiAPI.explainSolution({
        problemDescription: description,
        difficulty,
      });
      setExplanation(res.data.data);
      setActiveSection("beginner");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate explanation");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "beginner", label: "Beginner", icon: Sparkles, color: "text-easy" },
    { id: "detailed", label: "Detailed", icon: BookOpen, color: "text-accent" },
    { id: "time", label: "Time", icon: Zap, color: "text-medium" },
    { id: "space", label: "Space", icon: TrendingUp, color: "text-hard" },
  ];

  const sectionContent = explanation
    ? {
        beginner: explanation.beginnerExplanation,
        detailed: explanation.detailedExplanation,
        time: explanation.timeComplexity,
        space: explanation.spaceComplexity,
      }
    : {};

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card p-6">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
          Problem Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the problem description here..."
          rows={5}
          className="w-full bg-bg-input border border-border rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-easy/40 transition-colors"
        />

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  difficulty === d
                    ? difficultyColors[d].active
                    : difficultyColors[d].inactive
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExplain}
            disabled={loading || !description.trim()}
            className="ml-auto px-6 py-2.5 rounded-xl bg-easy text-bg-primary font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-easy/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            {loading ? "Analyzing..." : "Explain Solution"}
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-hard/10 border border-hard/20 text-hard text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <div className="glass-card">
          <TypingIndicator />
        </div>
      )}

      {/* Output */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Section Tabs */}
          <div className="flex border-b border-border">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === s.id
                    ? `${s.color} border-b-2 border-current bg-white/2`
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <RenderContent text={sectionContent[activeSection]} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TUTOR CHAT TAB
// ═══════════════════════════════════════════════════════════════
function TutorTab() {
  const [topic, setTopic] = useState("Binary Search");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!question.trim()) return;
    const userMsg = { role: "user", topic, content: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    setError("");
    try {
      const res = await aiAPI.chat({ topic, question });
      const aiMsg = { role: "ai", content: res.data.data.response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Topic Selector */}
      <div className="glass-card p-6">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          Select Topic
        </label>
        <div className="flex flex-wrap gap-2">
          {tutorTopics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                topic === t
                  ? "bg-medium text-bg-primary shadow-md shadow-medium/20"
                  : "bg-medium/10 text-medium border border-medium/20 hover:bg-medium/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-hard/10 border border-hard/20 text-hard text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Chat Messages */}
      <div className="glass-card overflow-hidden">
        {messages.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-medium/10 flex items-center justify-center mx-auto mb-4"
            >
              <MessageSquare className="w-7 h-7 text-medium" />
            </motion.div>
            <p className="text-sm text-text-secondary">
              Ask me anything about <span className="text-medium font-semibold">{topic}</span>
            </p>
            <p className="text-xs text-text-muted mt-1">
              I'll explain with examples, analogies, and code snippets
            </p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                    msg.role === "user"
                      ? "bg-accent/15 border border-accent/20 text-text-primary"
                      : "bg-bg-input border border-border text-text-secondary"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div>
                      <span className="text-[10px] text-accent font-medium uppercase tracking-wider">
                        {msg.topic}
                      </span>
                      <p className="text-sm mt-1">{msg.content}</p>
                    </div>
                  ) : (
                    <RenderContent text={msg.content} />
                  )}
                </div>
              </motion.div>
            ))}
            {loading && <TypingIndicator />}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${topic}...`}
              rows={1}
              className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-medium/40 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={loading || !question.trim()}
              className="w-11 h-11 rounded-xl bg-medium text-bg-primary flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-medium/20 shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CODE REVIEW TAB
// ═══════════════════════════════════════════════════════════════
function ReviewTab() {
  const [code, setCode] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setReview(null);
    try {
      const res = await aiAPI.reviewCode({
        code,
        problemDescription: problemDescription || undefined,
      });
      setReview(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to review code");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!review) return;
    const text = `Logic: ${review.logic}\nTime: ${review.timeComplexity}\nSpace: ${review.spaceComplexity}\nBugs: ${review.bugs}\nOptimizations: ${review.optimizations}\nScore: ${review.score}/10`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor =
    review?.score >= 8
      ? "text-easy"
      : review?.score >= 5
        ? "text-medium"
        : "text-hard";

  const scoreBg =
    review?.score >= 8
      ? "bg-easy/10 border-easy/20"
      : review?.score >= 5
        ? "bg-medium/10 border-medium/20"
        : "bg-hard/10 border-hard/20";

  const reviewSections = review
    ? [
        {
          label: "Logic Analysis",
          icon: CheckCircle2,
          text: review.logic,
          color: "text-easy",
          borderColor: "border-easy/20",
        },
        {
          label: "Time Complexity",
          icon: Zap,
          text: review.timeComplexity,
          color: "text-medium",
          borderColor: "border-medium/20",
        },
        {
          label: "Space Complexity",
          icon: TrendingUp,
          text: review.spaceComplexity,
          color: "text-accent",
          borderColor: "border-accent/20",
        },
        {
          label: "Bugs Found",
          icon: XCircle,
          text: review.bugs,
          color: "text-hard",
          borderColor: "border-hard/20",
        },
        {
          label: "Optimizations",
          icon: AlertTriangle,
          text: review.optimizations,
          color: "text-medium",
          borderColor: "border-medium/20",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card p-6">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
          Your Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here for review..."
          rows={10}
          className="w-full bg-bg-input border border-border rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-hard/40 transition-colors font-[JetBrains_Mono]"
          spellCheck={false}
        />

        <div className="mt-4">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            Problem Context <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Optionally describe the problem this code solves..."
            rows={3}
            className="w-full bg-bg-input border border-border rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-hard/40 transition-colors"
          />
        </div>

        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReview}
            disabled={loading || !code.trim()}
            className="px-6 py-2.5 rounded-xl bg-hard text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-hard/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SearchCode className="w-4 h-4" />
            )}
            {loading ? "Reviewing..." : "Review Code"}
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-hard/10 border border-hard/20 text-hard text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <div className="glass-card">
          <TypingIndicator />
        </div>
      )}

      {/* Review Output */}
      {review && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Score Card */}
          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Overall Score
              </p>
              <p className="text-sm text-text-secondary">{review.summary}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                title="Copy review"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-easy" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <div
                className={`w-16 h-16 rounded-2xl border ${scoreBg} flex items-center justify-center`}
              >
                <span className={`text-2xl font-bold font-[JetBrains_Mono] ${scoreColor}`}>
                  {review.score}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Sections */}
          {reviewSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-5 border-l-2 ${section.borderColor}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className={`w-4 h-4 ${section.color}`} />
                <h4 className={`text-sm font-semibold ${section.color}`}>
                  {section.label}
                </h4>
              </div>
              <RenderContent text={section.text} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN AI FEATURES PAGE
// ═══════════════════════════════════════════════════════════════
export default function AIFeatures() {
  const [activeTab, setActiveTab] = useState("hints");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              AI Study Tools
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Your AI <span className="gradient-text">Learning Assistant</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Powered by Gemini AI — get hints, explanations, tutoring, and code reviews
          </p>
        </motion.div>
      </div>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-1.5 mb-8 flex gap-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white/8 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary hover:bg-white/3"
            }`}
          >
            <tab.icon
              className={`w-4 h-4 ${
                activeTab === tab.id ? tab.color : ""
              }`}
            />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "hints" && <HintsTab />}
          {activeTab === "explain" && <ExplainTab />}
          {activeTab === "tutor" && <TutorTab />}
          {activeTab === "review" && <ReviewTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
