import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to access this resource.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();

})

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler("Not authorized to access this resource", 403));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler("You do not have permission to perform this action", 403));
        }
        next();
    };
};
