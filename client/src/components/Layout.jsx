import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Swords,
  User,
  LogOut,
  Code2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/challenges", icon: Swords, label: "Challenges" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-grid">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="fixed left-0 top-0 h-full w-[72px] hidden lg:flex flex-col items-center py-6 z-50 border-r border-border bg-bg-card/80 backdrop-blur-xl">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center glow-accent-sm">
            <Code2 className="w-5 h-5 text-accent" />
          </div>
        </motion.div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={label}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-bg-primary shadow-lg shadow-accent/30"
                      : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-text-muted hover:text-hard hover:bg-hard/10 transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </aside>

      {/* ── Top Bar (Mobile) ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 border-b border-border bg-bg-card/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm font-semibold gradient-text">
            LeetCoach AI
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile Nav Drawer ── */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden fixed top-16 left-0 right-0 z-40 border-b border-border bg-bg-card/95 backdrop-blur-xl"
        >
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-accent text-bg-primary font-medium"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-hard hover:bg-hard/10 transition-all mt-2 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </motion.div>
      )}

      {/* ── Main Content ── */}
      <main className="lg:ml-[72px] pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
