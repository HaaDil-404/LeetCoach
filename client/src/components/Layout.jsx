import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Swords,
  User,
  LogOut,
  Code2,
  Menu,
  X,
  BrainCircuit,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/challenges", icon: Swords, label: "Challenges" },
  { to: "/ai", icon: BrainCircuit, label: "AI Tools" },
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
    <div className="app-layout bg-grid">
      {/* ── Desktop / Tablet Sidebar ── */}
      <aside className="app-sidebar hidden md:flex">
        {/* Logo */}
        <div className="sidebar-logo">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="sidebar-logo-icon glow-accent-sm"
          >
            <Code2 className="w-5 h-5 text-accent" />
          </motion.div>
          <span className="sidebar-logo-text">LeetCoach</span>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-nav-item w-full text-text-muted hover:text-hard hover:bg-hard/10 cursor-pointer"
            title="Logout"
          >
            <LogOut className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="mobile-header md:hidden">
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
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="drawer-overlay md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="drawer-panel md:hidden"
            >
              {/* Drawer Logo */}
              <div className="sidebar-logo">
                <div className="sidebar-logo-icon glow-accent-sm">
                  <Code2 className="w-5 h-5 text-accent" />
                </div>
                <span className="sidebar-logo-text">LeetCoach</span>
              </div>

              {/* Drawer Nav */}
              <nav className="sidebar-nav">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `sidebar-nav-item ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Drawer Logout */}
              <div className="sidebar-footer">
                <button
                  onClick={handleLogout}
                  className="sidebar-nav-item w-full text-text-muted hover:text-hard hover:bg-hard/10 cursor-pointer"
                >
                  <LogOut className="nav-icon" />
                  <span className="nav-label">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
