import { createSlice } from "@reduxjs/toolkit";
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

        //GET USER REQUEST
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

        //Forgot Password
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
            state.message = null;
        },



        //RESET AUTH SLICE
        resetAuthSlice: (state) => {
            state.loading = false;
            state.error = null;
            state.user = null;
            state.message = null;
            state.isAuthenticated = false;
        },

        //RESET PASSWORD
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
            state.message = null;
        },


        //Update Password
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
        dispatch(authSlice.actions.resetAuthSlice());
    }
    ).catch((error) => {
        dispatch(authSlice.actions.logoutFailure(error.response.data.message))
    }
    )
}


//RESET AUTH
export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
}

//GET USER
export const getUser = () => async (dispatch) => {
    dispatch(authSlice.actions.getUserRequest());
    await axios.get("/api/v1/auth/user", {
        withCredentials: true,
    }).then((res) => {
        dispatch(authSlice.actions.getUserSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.getUserFailure(error.response.data.message))
    }
    )
}

//FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest());
    await axios.post("/api/v1/auth/password/forgot", { email }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        dispatch(authSlice.actions.forgotPasswordSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.forgotPasswordFailure(error.response.data.message))
    }
    )
}

//RESET PASSWORD
export const resetPassword = (token, data) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest());
    await axios.put(`/api/v1/auth/password/reset/${token}`,data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        dispatch(authSlice.actions.resetPasswordSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.resetPasswordFailure(error.response.data.message))
    }
    )
}

//UPDATE PASSWORD
export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());
    await axios.put("/api/v1/auth/password/update", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        dispatch(authSlice.actions.updatePasswordSuccess(
            res.data
        ))
    }
    ).catch((error) => {
        dispatch(authSlice.actions.updatePasswordFailure(error.response.data.message))
    }       
    )
}


export default authSlice.reducer;