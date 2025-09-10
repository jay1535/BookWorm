import { } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        user: null,
        message: null,
        isAuthenticated: false
    },
    reducers: {
        //REGISTER REQUEST
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

        //OTP VERIFICATION
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


        //LOGIN USER
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

        //LOGOUT USER
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
            state.message = null;
        },


    }

});



//REGISTER USER
export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest());
    await axios.post("/api/v1/auth/register", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        dispatch(authSlice.actions.registerSuccess(
            res.data
        ))
    }).catch((error) => {
        dispatch(authSlice.actions.registerFailure(error.response.data.message))
    })
}


//OTP VERIFICATION
export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.actions.OtpVerificationRequest());
    await axios.post("/api/v1/auth/otp-verification", { email, otp }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        dispatch(authSlice.actions.OtpVerificationSuccess(
            res.data
        ))
    }).catch((error) => {
        dispatch(authSlice.actions.OtpVerificationFailure(error.response.data.message))
    })
}

//LOGIN USER
export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.LoginRequest());
    await axios.post("/api/v1/auth/login", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {

        dispatch(authSlice.actions.LoginSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.LoginFailure(error.response.data.message))
    }
    )
}

//LOGOUT USER
export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.logoutRequest());
    await axios.get("/api/v1/auth/logout", {
        withCredentials: true,
    }).then((res) => {
        dispatch(authSlice.actions.logoutSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.logoutFailure(error.response.data.message))
    }
    )
}

