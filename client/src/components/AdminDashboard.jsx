import React, { useEffect, useMemo } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";

import logoWithTitleWhite from "../assets/logo-with-title.png";

import {
  Users,
  ShieldCheck,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import {
  toggleAddNewAdminPopup,
} from "../store/slices/popUpSlice";

import AddNewAdmin from "../popups/AddNewAdmin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { addNewAdminPopup } = useSelector((state) => state.popup);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  /* ================= CALCULATED STATS ================= */
  const stats = useMemo(() => {
    const admins = users?.filter((u) => u.role === "Admin").length || 0;
    const normalUsers = users?.filter((u) => u.role === "User").length || 0;

    const totalTitles = books?.length || 0;

    const availableCopies =
      books?.reduce((sum, b) => sum + b.quantity, 0) || 0;

    const borrowedCopies =
      allBorrowedBooks?.filter((b) => !b.returnDate).length || 0;

    return {
      admins,
      users: normalUsers,
      totalTitles,
      availableCopies,
      borrowedCopies,
    };
  }, [users, books, allBorrowedBooks]);

  /* ================= PIE CHART ================= */
  const pieData = {
    labels: ["Available Copies", "Borrowed Copies"],
    datasets: [
      {
        data: [stats.availableCopies, stats.borrowedCopies],
        backgroundColor: ["#000000", "#D1D5DB"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 14,
          color: "#000",
        },
      },
    },
  };

  /* ================= WEEKLY BORROW TREND ================= */
  const weeklyTrend = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = Array(7).fill(0);

    allBorrowedBooks?.forEach((borrow) => {
      if (borrow.borrowDate) {
        const dayIndex = new Date(borrow.borrowDate).getDay();
        counts[dayIndex]++;
      }
    });

    return { days, counts };
  }, [allBorrowedBooks]);

  const barData = {
    labels: weeklyTrend.days,
    datasets: [
      {
        data: weeklyTrend.counts,
        backgroundColor: "#000000",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: { stepSize: 1 },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <Header />

      {/* ================= ADD ADMIN POPUP ================= */}
      {addNewAdminPopup && (
        <AddNewAdmin
          onClose={() => dispatch(toggleAddNewAdminPopup())}
        />
      )}

      <main className="min-h-screen bg-gray-50 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-6 space-y-14">

          {/* ================= HEADER ================= */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-black">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Monitor users, inventory, and borrowing activity in real time.
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition"
            >
              + Add Admin
            </button>
          </section>

          {/* ================= METRICS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Metric icon={<ShieldCheck size={20} />} label="Admins" value={stats.admins} />
            <Metric icon={<Users size={20} />} label="Users" value={stats.users} />
            <Metric icon={<BookOpen size={20} />} label="Book Titles" value={stats.totalTitles} />
            <Metric icon={<TrendingUp size={20} />} label="Active Borrows" value={stats.borrowedCopies} />
          </section>

          {/* ================= CHARTS ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-1">
                Inventory Distribution
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Available vs borrowed copies
              </p>

              <div className="flex justify-center">
                <div className="w-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-1">
                Weekly Borrow Trend
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Actual borrowing activity (Sun–Sat)
              </p>

              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </section>

          {/* ================= FINAL BLACK SECTION ================= */}
          <section className="rounded-2xl bg-black text-white p-12 flex flex-col items-center text-center">
            <img
              src={logoWithTitleWhite}
              alt="BookWorm"
              className="h-16 mb-6"
            />

            <h3 className="text-xl font-semibold mb-3">
              Administrative Overview
            </h3>
            <p className="text-gray-300 max-w-2xl leading-relaxed">
              This dashboard provides complete visibility into library
              operations, enabling administrators to manage inventory,
              users, and borrowing efficiency with confidence.
            </p>
          </section>

        </div>
      </main>
    </>
  );
};

/* ================= METRIC CARD ================= */
const Metric = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-4">
    <div className="rounded-lg bg-black p-2 text-white">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
