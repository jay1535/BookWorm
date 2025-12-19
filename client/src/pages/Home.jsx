import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
  Clock,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const THEME_KEY = "bookworm-theme";

const Home = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={theme === "dark" ? "/white-logo.png" : "/black-logo.png"}
              alt="BookWorm Logo"
              className="h-8"
            />
            <div className="leading-tight">
              <div className="text-2xl font-extrabold tracking-tight">
                Book<span className="opacity-60">Worm</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Knowledge, Structured
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a className="hover:text-black dark:hover:text-white transition cursor-pointer">
              Features
            </a>
            <a className="hover:text-black dark:hover:text-white transition cursor-pointer">
              Roles
            </a>
            <a className="hover:text-black dark:hover:text-white transition cursor-pointer">
              Dashboard
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <IconButton
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </IconButton>

            <Button>
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>

            <Button variant="solid">
              <UserPlus className="w-4 h-4" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative text-center px-6 pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-100/70 via-transparent to-transparent dark:from-neutral-900/70" />

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto">
          A Smarter Way to
          <br />
          <span className="opacity-60">
            Manage Your Library
          </span>
        </h1>

        <p className="mt-10 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          BookWorm is a modern library management system designed to
          organize collections, streamline circulation, and improve
          accessibility for administrators, librarians, and members.
        </p>

        <div className="mt-16 flex justify-center gap-5">
          <Button size="lg" variant="solid">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button size="lg">
            Sign In
          </Button>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-3 gap-14 text-center">
          <Stat value="10,000+" label="Books Catalogued" />
          <Stat value="2,000+" label="Registered Members" />
          <Stat value="24/7" label="System Availability" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-36">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-24">
            Core Features That Matter
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <FeatureCard
              icon={<LayoutDashboard />}
              title="Unified Dashboard"
              desc="Monitor inventory, members, and circulation activity from a single, intuitive interface."
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="Role-Based Access Control"
              desc="Secure authentication with permissions tailored for administrators, librarians, and users."
            />
            <FeatureCard
              icon={<Clock />}
              title="Automated Circulation"
              desc="Issue books, manage returns, and track due dates with minimal manual intervention."
            />
          </div>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="bg-gray-50 dark:bg-neutral-950 py-36 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-24">
            Built for Every Library Role
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <RoleCard
              icon={<ShieldCheck />}
              title="Administrator"
              desc="Manage users, configure system settings, and review library analytics."
            />
            <RoleCard
              icon={<Users />}
              title="Librarian"
              desc="Handle daily operations including book issuance, returns, and catalog updates."
            />
            <RoleCard
              icon={<GraduationCap />}
              title="Member / Student"
              desc="Search the catalog, track borrowed books, and receive due date reminders."
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-36 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-transparent to-white/10" />

        <h2 className="text-4xl font-extrabold mb-8">
          Simplify Library Management
        </h2>

        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-14">
          Designed for institutions that prioritize organization,
          reliability, and efficient information management.
        </p>

        <Button size="lg" variant="invert">
          Access BookWorm
        </Button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} BookWorm · Library Management System
      </footer>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const IconButton = ({ children, ...props }) => (
  <button
    {...props}
    className="w-9 h-9 rounded-xl border border-gray-300 dark:border-gray-700 
               flex items-center justify-center
               hover:bg-gray-100 dark:hover:bg-gray-900 transition"
  >
    {children}
  </button>
);

const Button = ({ children, variant = "outline", size = "md" }) => {
  const sizes = {
    md: "px-4 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variants = {
    outline:
      "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900",
    solid:
      "bg-black text-white dark:bg-white dark:text-black shadow-sm hover:shadow-md hover:-translate-y-[1px]",
    invert:
      "bg-white text-black shadow-sm hover:shadow-md hover:-translate-y-[1px]",
  };

  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all 
                  ${sizes[size]} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-14 bg-white dark:bg-black
                  hover:shadow-xl hover:-translate-y-2 transition">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const RoleCard = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-14 bg-white/70 dark:bg-black/70 backdrop-blur
                  hover:shadow-xl hover:-translate-y-2 transition">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const Stat = ({ value, label }) => (
  <div>
    <div className="text-4xl font-extrabold">{value}</div>
    <div className="mt-2 text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export default Home;
