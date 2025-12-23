import React, { useEffect, useMemo } from "react";
import Header from "../layout/Header";
import logoWithTitle from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import Loading from "../pages/Loading";

/* ================= CENTER TEXT PLUGIN ================= */
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    const data = chart.data.datasets[0].data;
    const total = data.reduce((a, b) => a + b, 0);

    ctx.restore();
    ctx.font = "600 16px Inter, sans-serif";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Total ${total}`, width / 2, height / 2);
    ctx.save();
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, centerTextPlugin);

const UserDashboard = () => {
  const dispatch = useDispatch();

  const { userBorrowedBooks, loading } = useSelector(
    (state) => state.borrow
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  /* ================= CALCULATE STATS ================= */
  const stats = useMemo(() => {
    let borrowed = 0;
    let returned = 0;
    let overdue = 0;

    userBorrowedBooks.forEach((b) => {
      if (b.returnDate) {
        returned++;
      } else {
        borrowed++;
        if (new Date() > new Date(b.dueDate)) {
          overdue++;
        }
      }
    });

    return { borrowed, returned, overdue };
  }, [userBorrowedBooks]);

  /* ================= PIE CHART DATA ================= */
  const pieData = {
    labels: ["Borrowed", "Returned", "Overdue"],
    datasets: [
      {
        data: [
          stats.borrowed,
          stats.returned,
          stats.overdue,
        ],
        backgroundColor: [
          "#1E3A8A", // Indigo
          "#059669", // Green
          "#DC2626", // Red
        ],
        hoverBackgroundColor: [
          "#1D4ED8",
          "#10B981",
          "#EF4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 18,
          boxWidth: 12,
          font: {
            size: 12,
            weight: "500",
          },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#F9FAFB",
        bodyColor: "#E5E7EB",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <Loading/>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-28 pb-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-12">

          {/* ================= HERO ================= */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                User Dashboard
              </h1>
              <p className="mt-2 text-gray-500 max-w-lg">
                Track your borrowed books, returns, and due dates in one place.
              </p>
            </div>

            <img
              src={logoWithTitle}
              alt="BookWorm"
              className="h-14 md:h-16"
            />
          </section>

          {/* ================= STATS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={bookIcon}
              label="Borrowed Books"
              value={stats.borrowed}
            />
            <StatCard
              icon={returnIcon}
              label="Returned Books"
              value={stats.returned}
            />
            <StatCard
              icon={browseIcon}
              label="Overdue Books"
              value={stats.overdue}
              danger
            />
          </section>

          {/* ================= CHART + INFO ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Borrowing Overview
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Visual breakdown of your library activity
              </p>

              <div className="flex justify-center">
                <div className="w-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-black text-white p-8 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">
                📚 Reading Tip
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Stay consistent with due dates to avoid fines and
                maintain uninterrupted access to library resources.
              </p>

              <div className="mt-6 text-sm text-gray-400">
                — BookWorm Library
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ icon, label, value, danger }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-5">
    <img src={icon} className="h-10" alt="" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-bold ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default UserDashboard;
