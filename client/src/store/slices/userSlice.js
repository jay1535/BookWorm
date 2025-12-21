import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  users: [],
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /* ===== FETCH USERS ===== */
    fetchAllUsersRequest(state) {
      state.loading = true;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state) {
      state.loading = false;
    },

    /* ===== ADD ADMIN ===== */
    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state) {
      state.loading = false;
    },
  },
});

/* ===== EXPORT ACTIONS ===== */
export const {
  fetchAllUsersRequest,
  fetchAllUsersSuccess,
  fetchAllUsersFailed,
  addNewAdminRequest,
  addNewAdminSuccess,
  addNewAdminFailed,
} = userSlice.actions;

/* ================= THUNKS ================= */

/* 🔹 GET ALL USERS */
export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(fetchAllUsersRequest());

    const { data } = await axios.get(
      "/api/v1/user/all",
      { withCredentials: true }
    );

    dispatch(fetchAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(fetchAllUsersFailed());
    toast.error(
      error?.response?.data?.message || "Failed to fetch users"
    );
  }
};

/* 🔹 ADD NEW ADMIN */
export const addNewAdmin = (adminData) => async (dispatch) => {
  try {
    dispatch(addNewAdminRequest());

    const { data } = await axios.post(
      "/api/v1/user/add/new-admin",
      adminData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(addNewAdminSuccess());
    toast.success(data.message || "Admin added successfully");


    dispatch(fetchAllUsers());
  } catch (error) {
    dispatch(addNewAdminFailed());
    toast.error(
      error?.response?.data?.message || "Failed to add admin"
    );
  }
};

export default userSlice.reducer;
