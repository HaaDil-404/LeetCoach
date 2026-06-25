import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Code2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    authAPI
      .getMe()
      .then((res) => {
        setProfile(res.data.data);
        updateUser(res.data.data);
      })
      .catch(() => {});
  }, []);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const stats = [
    {
      label: "Current Streak",
      value: profile?.currentStreak || 0,
      icon: Flame,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Longest Streak",
      value: profile?.longestStreak || 0,
      icon: Trophy,
      color: "text-medium",
      bg: "bg-medium/10",
    },
    {
      label: "Total Solved",
      value: profile?.totalSolved || 0,
      icon: CheckCircle2,
      color: "text-easy",
      bg: "bg-easy/10",
    },
  ];

  // Initials avatar
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
            <User className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Your <span className="gradient-text">Profile</span>
          </h1>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-8 text-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-accent/10 to-transparent" />

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="relative z-10 mb-5"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-accent/30">
                <span className="text-2xl font-bold text-bg-primary">
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 left-1/2 translate-x-1.5 w-6 h-6 rounded-lg bg-easy flex items-center justify-center shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-bg-primary" />
              </div>
            </motion.div>

            {/* Info */}
            <h2 className="text-lg font-bold text-text-primary relative z-10">
              {profile?.name}
            </h2>

            <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
              <Mail className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-sm text-text-secondary">
                {profile?.email}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-xs text-text-muted">
                Member since {memberSince}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-6 relative z-10" />

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-4 relative z-10">
              <div className="text-center">
                <div className="text-xl font-bold text-accent font-[JetBrains_Mono]">
                  {profile?.currentStreak || 0}
                </div>
                <div className="text-xs text-text-muted mt-0.5">Streak</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-easy font-[JetBrains_Mono]">
                  {profile?.totalSolved || 0}
                </div>
                <div className="text-xs text-text-muted mt-0.5">Solved</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-medium font-[JetBrains_Mono]">
                  {profile?.longestStreak || 0}
                </div>
                <div className="text-xs text-text-muted mt-0.5">Best</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats & Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-text-primary font-[JetBrains_Mono]">
                  {stat.value}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity Overview */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-text-primary">
                Activity Overview
              </h3>
            </div>

            {/* Visual streak bar */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">
                    Current Streak
                  </span>
                  <span className="text-xs font-semibold text-accent font-[JetBrains_Mono]">
                    {profile?.currentStreak || 0} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-input overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(((profile?.currentStreak || 0) / Math.max(profile?.longestStreak || 1, 1)) * 100, 100)}%`,
                    }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">
                    Longest Streak
                  </span>
                  <span className="text-xs font-semibold text-medium font-[JetBrains_Mono]">
                    {profile?.longestStreak || 0} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-input overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-medium to-yellow-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">
                    Total Problems Solved
                  </span>
                  <span className="text-xs font-semibold text-easy font-[JetBrains_Mono]">
                    {profile?.totalSolved || 0}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-input overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(((profile?.totalSolved || 0) / 100) * 100, 100)}%`,
                    }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-easy to-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="glass-card-sm p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 animate-float">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">
                {(profile?.currentStreak || 0) > 0
                  ? `You're on a ${profile.currentStreak}-day streak! Keep the momentum going! 🔥`
                  : "Start solving today's challenges to begin your streak! 💪"}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Consistency is the key to mastering algorithms
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
