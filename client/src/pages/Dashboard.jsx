import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  CheckCircle2,
  Target,
  TrendingUp,
  Sparkles,
  Swords,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { challengeAPI } from "../api";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    challengeAPI
      .getTodayChallenge()
      .then((res) => setChallenge(res.data.data))
      .catch(() => {});
  }, []);

  const completedCount = challenge?.completedProblems?.length || 0;

  const stats = [
    {
      label: "Current Streak",
      value: user?.currentStreak || 0,
      icon: Flame,
      color: "text-accent",
      bg: "bg-accent/10",
      glow: "shadow-accent/20",
      suffix: "days",
    },
    {
      label: "Longest Streak",
      value: user?.longestStreak || 0,
      icon: Trophy,
      color: "text-medium",
      bg: "bg-medium/10",
      glow: "shadow-medium/20",
      suffix: "days",
    },
    {
      label: "Total Solved",
      value: user?.totalSolved || 0,
      icon: CheckCircle2,
      color: "text-easy",
      bg: "bg-easy/10",
      glow: "shadow-easy/20",
      suffix: "problems",
    },
    {
      label: "Daily Progress",
      value: `${completedCount}/3`,
      icon: Target,
      color: "text-hard",
      bg: "bg-hard/10",
      glow: "shadow-hard/20",
      suffix: "complete",
    },
  ];

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
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Here's your coding journey at a glance
          </p>
        </motion.div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-card p-5 group cursor-default hover:shadow-lg ${stat.glow} transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 font-[JetBrains_Mono]">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Today's Progress
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {completedCount === 3
                ? "All challenges completed! 🎉"
                : `${3 - completedCount} challenge${3 - completedCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <span className="text-lg font-bold font-[JetBrains_Mono] text-accent">
            {Math.round((completedCount / 3) * 100)}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-bg-input overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 3) * 100}%` }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-accent to-amber-400"
          />
        </div>
        <div className="flex justify-between mt-3">
          {["Easy", "Medium", "Hard"].map((diff, idx) => {
            const colors = {
              Easy: "bg-easy",
              Medium: "bg-medium",
              Hard: "bg-hard",
            };
            const done = idx < completedCount;
            return (
              <div key={diff} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${done ? colors[diff] : "bg-text-muted/30"}`}
                />
                <span
                  className={`text-xs ${done ? "text-text-primary" : "text-text-muted"}`}
                >
                  {diff}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/challenges")}
          className="glass-card p-6 flex items-center gap-4 group cursor-pointer text-left hover:border-accent/20 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Swords className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
              Today's Challenges
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              View and solve your daily problems
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/profile")}
          className="glass-card p-6 flex items-center gap-4 group cursor-pointer text-left hover:border-easy/20 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-easy/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-easy" />
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-easy transition-colors">
              View Profile
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              Track your stats and progress
            </div>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
