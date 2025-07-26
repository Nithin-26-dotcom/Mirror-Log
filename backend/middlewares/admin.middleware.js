import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
const isAdmin = asyncHandler(async (req, resizeBy, next) => {
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized access. Only admin users can perform this action");
    }
    next();
})

export { isAdmin };