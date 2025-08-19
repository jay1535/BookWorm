import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    role:{
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    accountVerified:{
        type: Boolean,
        default: false,
    },
    borrowedBooks: [{
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Borrow"
        },
        returned:{
            type: Boolean,
            default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
    }],
    avatar:{
        public_id:String,
        url:String
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
})

export const User = mongoose.model("User", userSchema);