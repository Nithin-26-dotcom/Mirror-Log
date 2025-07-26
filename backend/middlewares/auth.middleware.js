import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
const verifyJWT = asyncHandler(async (req, res, next) => {
    const Accesstoken = req.signedCookies?.AccessToken || req.headers.authorization?.split(" ")[1];

    if (!Accesstoken) {
        throw new ApiError(401, "Access token missing or invalid");
    }

    let decoded;
    try {
        decoded = jwt.verify(Accesstoken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
})

export { verifyJWT };