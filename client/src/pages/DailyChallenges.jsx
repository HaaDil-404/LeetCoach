import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Sparkles,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Tag,
  BookOpen,
  CircleDot,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { challengeAPI } from "../api";

const difficultyConfig = {
  Easy: {
    color: "text-easy",
    bg: "bg-easy/10",
    border: "border-easy/20",
    glow: "shadow-easy/10",
    gradient: "from-easy/20 to-transparent",
  },
  Medium: {
    color: "text-medium",
    bg: "bg-medium/10",
    border: "border-medium/20",
    glow: "shadow-medium/10",
    gradient: "from-medium/20 to-transparent",
  },
  Hard: {
    color: "text-hard",
    bg: "bg-hard/10",
    border: "border-hard/20",
    glow: "shadow-hard/10",
    gradient: "from-hard/20 to-transparent",
  },
};

function ProblemCard({ problem, difficulty, isCompleted, onMarkComplete, isMarking }) {
  const config = difficultyConfig[difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className={`glass-card overflow-hidden group hover:shadow-lg ${config.glow} transition-all relative`}
    >
      {/* Difficulty gradient strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}
            >
              {difficulty}
            </span>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 className="w-5 h-5 text-easy" />
              </motion.div>
            )}
          </div>
          {problem.leetcodeLink && (
            <a
              href={problem.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors"
              title="Open on LeetCode"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
          {problem.title}
        </h3>

        {/* Topic */}
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-secondary font-medium">
            {problem.topic}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
              Description
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">
            {problem.description}
          </p>
        </div>

        {/* Examples */}
        {problem.examples?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CircleDot className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                Example
              </span>
            </div>
            <div className="bg-bg-input rounded-lg p-3 border border-border text-xs font-[JetBrains_Mono]">
              <div className="text-text-secondary">
                <span className="text-accent">Input:</span>{" "}
                {problem.examples[0].input}
              </div>
              <div className="text-text-secondary mt-1">
                <span className="text-easy">Output:</span>{" "}
                {problem.examples[0].output}
              </div>
              {problem.examples[0].explanation && (
                <div className="text-text-muted mt-1">
                  <span className="text-medium">Explanation:</span>{" "}
                  {problem.examples[0].explanation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints?.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                Constraints
              </span>
            </div>
            <ul className="space-y-1">
              {problem.constraints.map((c, i) => (
                <li
                  key={i}
                  className="text-xs text-text-secondary font-[JetBrains_Mono] flex items-start gap-2"
                >
                  <span className="text-text-muted mt-0.5">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mark Complete Button */}
        {!isCompleted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMarkComplete(problem._id)}
            disabled={isMarking}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${config.bg} ${config.color} border ${config.border} hover:shadow-lg ${config.glow} disabled:opacity-60`}
          >
            {isMarking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </>
            )}
          </motion.button>
        ) : (
          <div className="w-full py-2.5 rounded-xl bg-easy/10 text-easy text-sm font-semibold flex items-center justify-center gap-2 border border-easy/20">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function DailyChallenges() {
  const { updateUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [error, setError] = useState("");

  const fetchChallenge = async () => {
    try {
      const res = await challengeAPI.getTodayChallenge();
      setChallenge(res.data.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setChallenge(null);
      } else {
        setError("Failed to load challenges");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateChallenge = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await challengeAPI.generateChallenge();
      setChallenge(res.data.data);
      // Re-fetch with populated data
      await fetchChallenge();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate challenge"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkComplete = async (problemId) => {
    setMarkingId(problemId);
    try {
      const res = await challengeAPI.markComplete(problemId);
      setChallenge(res.data.data.challenge);
      updateUser(res.data.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to mark complete"
      );
    } finally {
      setMarkingId(null);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  const completedIds =
    challenge?.completedProblems?.map((p) =>
      typeof p === "string" ? p : p._id
    ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

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
            <Swords className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Daily Challenges
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Today's <span className="gradient-text">Problems</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Solve one Easy, one Medium, and one Hard problem each day
          </p>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 rounded-xl bg-hard/10 border border-hard/20 text-hard text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {!challenge ? (
        /* No challenge yet — generate */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 text-center max-w-lg mx-auto"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 glow-accent"
          >
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No Challenges Yet
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Generate today's AI-curated challenges to start solving
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateChallenge}
            disabled={generating}
            className="px-8 py-3 rounded-xl bg-accent text-bg-primary font-semibold text-sm inline-flex items-center gap-2 hover:bg-accent-hover transition-colors disabled:opacity-60 cursor-pointer shadow-lg shadow-accent/20"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Challenges
              </>
            )}
          </motion.button>
        </motion.div>
      ) : (
        /* Problem Cards */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {[
              { problem: challenge.easyProblem, difficulty: "Easy" },
              { problem: challenge.mediumProblem, difficulty: "Medium" },
              { problem: challenge.hardProblem, difficulty: "Hard" },
            ].map(
              ({ problem, difficulty }) =>
                problem && (
                  <ProblemCard
                    key={problem._id}
                    problem={problem}
                    difficulty={difficulty}
                    isCompleted={completedIds.includes(problem._id)}
                    onMarkComplete={handleMarkComplete}
                    isMarking={markingId === problem._id}
                  />
                )
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
