import React, { useState } from "react";
import logoWhite from "../assets/logo-with-title.png";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";

const AddNewAdmin = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(placeHolder);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    const result = await dispatch(addNewAdmin(formData));
    if (result?.type === "user/addNewAdminSuccess") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= LEFT (BLACK) SIDE ================= */}
        <div className="bg-black text-white p-10 flex flex-col justify-between">
          {/* TOP: CENTERED LOGO */}
          <div className="flex flex-col items-center text-center">
            <img
              src={logoWhite}
              alt="BookWorm"
              className="h-16 mb-6 select-none"
            />

            <div className="flex items-center gap-3 mb-4">
              <img src={keyIcon} alt="Admin" className="w-8 h-8" />
              <h2 className="text-2xl font-semibold">Add New Admin</h2>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Create a new administrator with elevated access to manage the
              system securely.
            </p>
          </div>

          {/* BOTTOM: AVATAR PREVIEW */}
          <div className="mt-10 flex items-center gap-4">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-full object-cover border border-gray-700"
            />
            <div>
              <p className="text-sm font-medium">Admin Avatar</p>
              <p className="text-xs text-gray-400">Live preview</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-10">
          <button onClick={onClose} className="absolute top-5 right-5">
            <img
              src={closeIcon}
              alt="Close"
              className="w-6 h-6 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Admin Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={avatarPreview}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <label className="cursor-pointer text-sm font-medium text-black">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 rounded-lg py-2.5 text-sm font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Creating Admin..." : "Create Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAdmin;
