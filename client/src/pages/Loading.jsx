import React from "react";
import logo from "../assets/white-logo.png";
import logoBlack from "../assets/black-logo.png";

const Loading = ({ theme = "light" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black text-black dark:text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/5 via-transparent to-transparent dark:from-white/5" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-black/10 dark:bg-white/10 blur-[120px]" />

      {/* CONTENT */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">

        {/* LOGO */}
        <div className="relative">
          <img
            src={theme === "light" ? logoBlack : logo}
            alt="BookWorm"
            className="w-16 h-16 animate-pulse-soft"
          />

          {/* RING */}
          <span className="absolute inset-0 rounded-full border border-black/20 dark:border-white/20 animate-ring" />
        </div>

        {/* BRAND */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Book<span className="opacity-50">Worm</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 tracking-wide">
            Preparing your library...
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-48 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full w-1/3 bg-black dark:bg-white animate-loading-bar" />
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }

        @keyframes ring {
          0% { transform: scale(0.9); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-loading-bar {
          animation: loadingBar 1.4s ease-in-out infinite;
        }

        .animate-ring {
          animation: ring 1.6s ease-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
