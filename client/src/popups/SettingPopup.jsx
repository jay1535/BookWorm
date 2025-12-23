import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close-square.png";
import placeHolder from "../assets/placeholder.jpg";
import logoWithTitle from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  updateAvatar,
  resetAuthSlice,
} from "../store/slices/authSlice";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const SettingPopup = () => {
  const dispatch = useDispatch();
  const { user, loading, success, message, error } = useSelector(
    (state) => state.auth
  );

  /* ================= TRACK ACTION ================= */
  const [actionType, setActionType] = useState(null);
  // "avatar" | "password"

  /* ================= PASSWORD STATE ================= */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= AVATAR STATE ================= */
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || placeHolder
  );

  /* ================= HANDLE SUCCESS / ERROR ================= */
  useEffect(() => {
    if (success) {
      toast.success(message || "Updated successfully");

      // Close popup always
      dispatch(toggleSettingPopup());

      // Redirect ONLY on password update
      if (actionType === "password") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // Reset local state
      setAvatar(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setActionType(null);

      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [success, error, actionType, message, dispatch]);

  /* ================= AVATAR ================= */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);

    // Preview ONLY if browser supports it
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(placeHolder);
    }
  };

  const handleAvatarUpdate = () => {
    if (!avatar) {
      toast.warning("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    setActionType("avatar");
    dispatch(updateAvatar(formData));
     dispatch(toggleSettingPopup());
  };

  /* ================= PASSWORD ================= */
  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.warning("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setActionType("password");
    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
     
    );
     dispatch(toggleSettingPopup());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-auto"
      onClick={() => dispatch(toggleSettingPopup())}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl overflow-y-auto grid grid-cols-1 md:grid-cols-2"
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-black text-white p-10 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <img
              src={logoWithTitle}
              alt="BookWorm"
              className="mx-auto mb-8 h-28 object-contain"
            />
            <h2 className="text-2xl font-semibold mb-2">
              Account Settings
            </h2>
            <p className="text-sm text-gray-300">
              Manage your security and profile details
            </p>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full object-cover border border-gray-600"
            />
            <div className="text-left">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-10">
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="absolute top-5 right-5"
          >
            <img src={closeIcon} alt="close" className="w-6 h-6 opacity-70" />
          </button>

          {/* ================= AVATAR ================= */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Update Avatar
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={avatarPreview}
                className="w-14 h-14 rounded-full object-cover border"
              />

              <label className="cursor-pointer text-sm font-medium text-black">
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              <button
                onClick={handleAvatarUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          {/* ================= PASSWORD ================= */}
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Change Password
            </h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-black"
            />

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-black py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
