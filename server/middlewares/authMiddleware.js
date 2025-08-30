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
    console.log(decoded);
    
    req.user = await User.findById(decoded.id);
    next();

})