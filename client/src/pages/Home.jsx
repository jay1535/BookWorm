import React, { useEffect, useState } from "react";
import logo from "../assets/white-logo.png";
import logo_black from "../assets/black-logo.png";
import { Menu, X } from "lucide-react";

import {
  Sun,
  Moon,
  LogIn,
  UserPlus,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  Users,
  CheckCircle,
  ListCheckIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";

const THEME_KEY = "bookworm-theme";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light"
  );

  /* ================= THEME HANDLING ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  /* ================= NAVIGATION ================= */
  const goToDashboard = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetAuthSlice());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">

      {/* ================= HEADER ================= */}
     <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

    {/* BRAND */}
    <div
      onClick={() => navigate("/")}
      className="cursor-pointer flex gap-3 items-center"
    >
      <img
        src={theme === "light" ? logo_black : logo}
        alt="BookWorm"
        className="w-10 h-10"
      />
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">
          Book<span className="text-gray-500">Worm</span>
        </h1>
        <span className="text-sm text-gray-500">Library</span>
      </div>
    </div>

    {/* DESKTOP NAV */}
    <nav className="hidden md:flex gap-10 text-lg font-semibold text-gray-600 dark:text-gray-400">
      <a href="#features" className="hover:text-black dark:hover:text-white">
        Features
      </a>
      <a href="#workflow" className="hover:text-black dark:hover:text-white">
        Workflow
      </a>
      <a href="#roles" className="hover:text-black dark:hover:text-white">
        Roles
      </a>
    </nav>

    {/* DESKTOP ACTIONS */}
    <div className="hidden md:flex items-center gap-3">
      {/* THEME TOGGLE */}
      <button
        className="border rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-blue-600" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {!isAuthenticated ? (
        <>
          <Button size="md" onClick={goToLogin}>
            <LogIn className="w-4 h-4" /> Sign In
          </Button>
          <Button size="md" variant="solid" onClick={goToRegister}>
            <UserPlus className="w-4 h-4" /> Get Started
          </Button>
        </>
      ) : (
        <>
          <Button size="md" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button size="md" variant="solid" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </>
      )}
    </div>

    {/* MOBILE ACTIONS */}
    <div className="md:hidden flex items-center gap-2">
      {/* THEME TOGGLE (LEFT OF MENU) */}
      <button
        className="border rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-blue-600" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {/* MENU BUTTON */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="border rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>
    </div>
  </div>

  {/* ================= MOBILE MENU ================= */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-white dark:bg-black border-t border-black/10 dark:border-white/10">
      <div className="flex flex-col items-center gap-6 px-6 py-8 text-lg font-semibold">

        {/* LINKS */}
        <a href="#features" onClick={() => setMobileMenuOpen(false)}>
          Features
        </a>
        <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>
          Workflow
        </a>
        <a href="#roles" onClick={() => setMobileMenuOpen(false)}>
          Roles
        </a>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col items-center gap-3 pt-2">
          {!isAuthenticated ? (
            <>
              <Button
                size="md"
                onClick={goToLogin}
                className="inline-flex max-w-fit px-5 py-2 text-sm justify-center"
              >
                Sign In
              </Button>
              <Button
                size="md"
                variant="solid"
                onClick={goToRegister}
                className="inline-flex max-w-fit px-5 py-2 text-sm justify-center"
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button
                size="md"
                onClick={() => navigate("/dashboard")}
                className="inline-flex max-w-fit px-5 py-2 text-sm justify-center"
              >
                Dashboard
              </Button>
              <Button
                size="md"
                variant="solid"
                onClick={handleLogout}
                className="inline-flex max-w-fit px-5 py-2 text-sm justify-center"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )}
</header>




      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
  {/* BACKGROUND GLOW */}
  <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/5 via-transparent to-transparent dark:from-white/5" />
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-black/10 dark:bg-white/10 blur-[120px]" />

  <div className="max-w-5xl mx-auto px-6 md:px-8 pt-14 md:pt-20 pb-28 md:pb-36 text-center">

    {/* MAIN HEADING */}
    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
      Organize Libraries
      <br />
      <span className="opacity-50">Without the Chaos...</span>
    </h2>

    {/* ANIMATED SUBTITLE */}
    <p
  className="
    mt-4 md:mt-6
    text-xl sm:text-2xl md:text-3xl
    font-semibold
    text-gray-500 dark:text-gray-400
    animate-journey
    tracking-wide
  "
>
  Login, Refresh, Start Your Journey
</p>


    {/* DESCRIPTION */}
    <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      BookWorm replaces spreadsheets, registers, and fragmented tools with a
      single intelligent platform designed for speed, clarity, and control.
    </p>

    {/* POINTS */}
    <ul className="mt-10 md:mt-12 space-y-4 max-w-xl mx-auto text-left">
      {[
        "Track books, members, and availability in real-time",
        "Secure role-based access for admins, librarians, and users",
        "Automated issuing, returns, and due-date management",
      ].map((text, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm sm:text-base"
        >
          <CheckCircle className="mt-1 shrink-0" />
          <span>{text}</span>
        </li>
      ))}
    </ul>

    {/* CTA */}
    {/* CTA */}
<div className="mt-12 md:mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 ">
  <Button
    size="md"
    variant="solid"
    onClick={goToDashboard}
    className="
      inline-flex
      max-w-fit
      self-center
      px-6 py-2.5
      text-sm
      justify-center
    "
  >
    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
    <ArrowRight className="w-4 h-4" />
  </Button>

  {!isAuthenticated && (
    <Button
      size="md"
      onClick={goToLogin}
      className="
        inline-flex
        max-w-fit
        self-center
        px-6 py-2.5
        text-sm
        justify-center
      "
    >
      Sign In
    </Button>
  )}
</div>


  </div>

  {/* ANIMATION STYLES */}
  <style>{`
    @keyframes journey {
      0% {
        opacity: 0.3;
        transform: translateX(-24px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .animate-journey {
      animation: journey 0.8s ease-out forwards;
    }
  `}</style>
</section>


      {/* ================= FEATURES ================= */}
      <section
  id="features"
  className="
    py-20 md:py-32
    border-t border-black/10 dark:border-white/10
    md:h-screen
  "
>
  <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
    <ListCheckIcon className="mx-auto mb-4 md:mb-6" />
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12">
      Key Features
    </h3>
  </div>

  <div className="max-w-6xl mx-auto px-6 md:px-8 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
    <Feature
      icon={<BookOpen />}
      title="Smart Catalog"
      desc="Centralized book database with advanced search, filters, and metadata."
    />
    <Feature
      icon={<Layers />}
      title="Role Based Access"
      desc="Admins, librarians, and members get tailored permissions and views."
    />
    <Feature
      icon={<Clock />}
      title="Automation"
      desc="Automatic due dates, availability updates, and circulation handling."
    />
  </div>
</section>


      {/* ================= WORKFLOW ================= */}
      <section
  id="workflow"
  className="
    py-20 md:py-32
    border-t border-black/10 dark:border-white/10
    md:h-screen
  "
>
  <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
    <Layers className="mx-auto mb-4 md:mb-6" />
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
      Simple Workflow
    </h3>
    <p className="text-gray-400 mb-10 md:mb-12 max-w-2xl mx-auto">
      Designed to be intuitive for both staff and users.
    </p>

    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-left">
      <Step
        title="1. Add & Organize"
        desc="Register books, categorize them, and manage availability."
      />
      <Step
        title="2. Issue & Track"
        desc="Issue books, monitor borrowers, and track due dates automatically."
      />
      <Step
        title="3. Monitor & Control"
        desc="Admins oversee usage, users, and system health in real time."
      />
    </div>
  </div>
</section>


      {/* ================= ROLES ================= */}
      <section
  id="roles"
  className="
    py-20 md:py-32
    md:h-screen
  "
>
  <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
    <Users className="mx-auto mb-4 md:mb-6" />
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
      Built for Everyone
    </h3>

    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
      <Role
        title="Admin"
        desc="Full control over users, books, reports, and analytics."
      />
      <Role
        title="Librarian"
        desc="Manage catalog, issue/return books, and assist members."
      />
      <Role
        title="Member"
        desc="Search, borrow, and track books with ease."
      />
    </div>
  </div>
</section>


      {/* ================= CTA ================= */}
      <section className="py-28 text-center border-t border-black/10 dark:border-white/10">
        <h3 className="text-4xl font-extrabold mb-6">
          Ready to Simplify Your Library?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10">
          BookWorm is built for institutions that value clarity, efficiency,
          and modern workflows.
        </p>

        <Button size="lg" variant="solid" onClick={goToDashboard}>
          {isAuthenticated ? "Start Your Journey" : "Access BookWorm"}
        </Button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-4 gap-12 text-sm">
          <div>
            <h4 className="text-xl font-bold mb-4">BookWorm</h4>
            <p className="text-gray-400">
              A modern library management system designed to simplify
              book tracking, user management, and circulation workflows.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#workflow" className="hover:text-white">Workflow</a></li>
              <li><a href="#roles" className="hover:text-white">Roles</a></li>
              <li className="hover:text-white cursor-pointer" onClick={goToDashboard}>
                Dashboard
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <ul className="space-y-2 text-gray-400">
              <li>MERN Stack</li>
              <li>JWT Authentication</li>
              <li>Role-Based Access</li>
              <li>REST APIs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <p className="text-gray-400">
              Final Year Engineering Project
              <br />
              Built with scalability and security in mind.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BookWorm · Library Management System
        </div>
      </footer>

      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Button = ({ children, variant = "outline", size = "md", ...props }) => {
  const sizes = { md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    outline: "border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5",
    solid: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition ${sizes[size]} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="p-10 rounded-3xl border border-black/10 dark:border-white/10 hover:shadow-xl transition">
    <div className="mb-6">{icon}</div>
    <h4 className="text-xl font-semibold mb-3">{title}</h4>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const Role = ({ title, desc }) => (
  <div className="p-10 rounded-3xl border border-black/10 dark:border-white/10">
    <h4 className="text-xl font-semibold mb-3">{title}</h4>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const Step = ({ title, desc }) => (
  <div className="p-8 rounded-2xl bg-white/10">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-gray-300">{desc}</p>
  </div>
);

export default Home;
