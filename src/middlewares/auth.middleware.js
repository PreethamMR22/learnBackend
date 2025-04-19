import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT= asyncHandler(async (req, _,next)=> {
    try {
        const token= req.cookies?.AccessToken || req.header ("Authorization")?.replace("Bearer ","");
        if(!token) {
            throw new ApiError(401,"UnAuthorized access");
        }
    
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user= await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user) {
            //front end alli eno maadbeku
            throw new ApiError(401,"Invalid Access Token");
        }
        //put a new object itself into it;
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid Access token");
    }
})