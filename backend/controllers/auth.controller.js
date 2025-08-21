// controllers/auth.controller.js
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { setAuthCookies, clearAuthCookies, verifyToken } from "../utils/jwt.js";

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "username, email, password are required");
  }
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, "Username or email already in use");

  const user = await User.create({ username, email, password });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: { id: user._id, username, email } },
        "Registered successfully"
      )
    );
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password)
    throw new ApiError(400, "username/email and password are required");

  const user = await User.findOne(username ? { username } : { email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

// @route POST /api/auth/refresh
// @route POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.signedCookies?.RefreshToken || req.body?.refreshToken;

  if (!token) throw new ApiError(400, "Refresh token missing");

  const payload = verifyToken(token);
  if (!payload) throw new ApiError(401, "Invalid or expired refresh token");

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.refreshToken !== token) {
    throw new ApiError(403, "Refresh token not recognized");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Token refreshed successfully"
      )
    );
});

// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }
  clearAuthCookies(res);
  return res.status(200).json(new ApiResponse(200, null, "Logged out"));
});

export { register, login, refresh, logout };
