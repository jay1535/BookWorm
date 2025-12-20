import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* ====================== AXIOS CONFIG ====================== */
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
/* ========================================================== */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    error: null,
    user: null,
    message: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    OtpVerificationRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    OtpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    OtpVerificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    LoginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    LoginSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    LoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logoutRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = true;
    },

    getUserRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetAuthSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.message = null;
      state.isAuthenticated = false;
    },

    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updatePasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ========= ✅ ADDED (SAFE HELPERS) ========= */
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
  },
});

/* ================= EXPORT ACTIONS ================= */

export const {
  registerRequest,
  registerSuccess,
  registerFailure,

  OtpVerificationRequest,
  OtpVerificationSuccess,
  OtpVerificationFailure,

  LoginRequest,
  LoginSuccess,
  LoginFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  getUserRequest,
  getUserSuccess,
  getUserFailure,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,

  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,

  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailure,

  resetAuthSlice,

  /* ✅ NEW EXPORTS */
  clearAuthError,
  clearAuthMessage,
} = authSlice.actions;

/* ================= THUNKS (UNCHANGED) ================= */

export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await axios.post("/api/v1/auth/register", data);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    dispatch(registerFailure(error.response?.data?.message));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(OtpVerificationRequest());
  try {
    const res = await axios.post("/api/v1/auth/otp-verification", { email, otp });
    dispatch(OtpVerificationSuccess(res.data));
  } catch (error) {
    dispatch(OtpVerificationFailure(error.response?.data?.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(LoginRequest());
  try {
    const res = await axios.post("/api/v1/auth/login", data);
    dispatch(LoginSuccess(res.data));
  } catch (error) {
    dispatch(LoginFailure(error.response?.data?.message));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    const res = await axios.get("/api/v1/auth/logout");
    dispatch(logoutSuccess(res.data));
    dispatch(resetAuthSlice());
  } catch (error) {
    dispatch(logoutFailure(error.response?.data?.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const res = await axios.get("/api/v1/auth/user");
    dispatch(authSlice.actions.getUserSuccess(res.data));
  } catch (error) {
    dispatch(
      authSlice.actions.getUserFailure(
        error.response?.data?.message || "User not authenticated"
      )
    );
  }
};


export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest());
  try {
    const res = await axios.post("/api/v1/auth/password/forgot", { email });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    dispatch(forgotPasswordFailure(error.response?.data?.message));
  }
};

export const resetPassword = (token, data) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  try {
    const res = await axios.put(
      `/api/v1/auth/password/reset/${token}`,
      data
    );
    dispatch(resetPasswordSuccess(res.data));
  } catch (error) {
    dispatch(resetPasswordFailure(error.response?.data?.message));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(updatePasswordRequest());
  try {
    const res = await axios.put("/api/v1/auth/password/update", data);
    dispatch(updatePasswordSuccess(res.data));
  } catch (error) {
    dispatch(updatePasswordFailure(error.response?.data?.message));
  }
};

export default authSlice.reducer;
