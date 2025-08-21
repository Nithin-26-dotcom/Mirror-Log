import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "nithin_secret";

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie("AccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      signed: true,
    });
  }
  if (refreshToken) {
    res.cookie("RefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      signed: true,
    });
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie("AccessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    signed: true,
  });
  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    signed: true,
  });
};

const verifyToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return null;
  }
};

export { setAuthCookies, clearAuthCookies, verifyToken };
