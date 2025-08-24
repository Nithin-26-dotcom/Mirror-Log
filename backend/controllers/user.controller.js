// controllers/user.controller.js
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookies } from "../utils/jwt.js";

// @route GET /api/user/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

// @route PATCH /api/user/me
const updateMe = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // Username update
  if (username && username !== user.username) {
    const exists = await User.findOne({ username });
    if (exists) throw new ApiError(400, "Username already taken");
    user.username = username;
  }

  // Email update
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, "Email already in use");
    user.email = email;
  }

  // Password update (handle hashing via schema pre-save hook)
  if (password) {
    user.password = password;
  }

  await user.save();

  const safe = user.toObject();
  delete safe.password;
  delete safe.refreshToken;

  return res
    .status(200)
    .json(new ApiResponse(200, safe, "Profile updated successfully"));
});

// @route DELETE /api/user/me
const deleteMe = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Incorrect password");

  // soft delete user add on not needed feature

  await User.findByIdAndDelete(req.user._id);

  clearAuthCookies(res);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Account deleted successfully"));
});

// ADMIN
// @route GET /api/admin/users
const adminListUsers = asyncHandler(async (req, res) => {
  console.log(req.user);
  if (req.user.role !== "admin") throw new ApiError(403, "Forbidden");

  const users = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

export { getMe, updateMe, deleteMe, adminListUsers };
