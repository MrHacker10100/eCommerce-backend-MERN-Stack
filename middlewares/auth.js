import catchAsyncErrors from "./catchAsyncError.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenicatedUser = catchAsyncErrors(async (req, res, next) =>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Unauthorized Access , Please login first to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
})

export const authorizeRoles = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    }
}