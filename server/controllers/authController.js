import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
     const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide all fields", 400));
    }
   
try {

    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered", 400));
    }
    const registrationAttemptByUser = await User.find({
        email,
        accountVerified: false,
    });
    if(registrationAttemptByUser.length >=5) {
        return next(
            new ErrorHandler("You have reached the maximum registration attempts. Please try again later.", 400)
        );
    }
    if(password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(
        verificationCode,
        email,
         res
    );
    
} 
catch (error) {
     next(error);
}

})


export  const verifyOtp = catchAsyncErrors(async(req, res, next) =>{
    const {email, otp} = req.body;
    if(!email || !otp){
        return next(new ErrorHandler("Email or Otp is missing",400))
    }
    try {
        const userAllEntries = await User.find({
            email,
            accountVerified :false,
        }).sort({
            createdAt: -1
        });

        if(!userAllEntries){
            return next(new ErrorHandler("User not found.",404));
        }

        let user;
        if(userAllEntries.length > 1){
            user = userAllEntries[0];
            await User.deleteMany({
                _id: {$ne: user._id},
                email,
                accountVerified:false
            })
        }else{
            user = userAllEntries[0];
        }

        if(user.verificationCode !== Number(otp)){
            return next(new ErrorHandler("Invalid OTP.",400))
        }
        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if(currentTime > verificationCodeExpire){
            return next(new ErrorHandler("Otp expired", 400));
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;

        await user.save({validateModifiedOnly : true});
        

        sendToken(user, 200, "Account verified.", res)
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error",500));
    }

})


export const login = catchAsyncErrors(async(req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please provide all fields",400));
    }

    const user = await User.findOne({email, accountVerified:true}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found or not verified",404));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",400));
    }
    sendToken(user, 200, `Welcome back, ${user.name}`, res);


})

