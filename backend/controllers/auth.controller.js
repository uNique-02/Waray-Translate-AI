import User from "../models/user.model.js";
import generateTokens, { saveRefreshToken } from "../utils/generateTokens.js";
import setCookies from "../utils/setCookies.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

import { OAuth2Client } from "google-auth-library";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d"; // Used for JWT, separate TTL for Redis
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskEmail(email) {
  if (!email || typeof email !== "string") return "unknown";
  const [name, domain] = email.split("@");
  if (!domain) return "invalid-email";
  const safeName = name.length <= 2 ? `${name[0] || "*"}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
}

function getRequestMeta(req) {
  return {
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedPassword = typeof password === "string" ? password : "";
    const trimmedConfirmPassword =
      typeof confirmPassword === "string" ? confirmPassword : "";

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({ message: "Name must be between 2 and 80 characters" });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (trimmedPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // UI Avatars - generates initials-based avatars (no external dependency issues)
    const picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=random`;

    const newUser = new User({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      picture: picture,
      role: role,
      isGoogleUser: false, // Default to false for regular signup
    });

    await newUser.save(); // Save user first

    const { accessToken, refreshToken } = await generateTokens(newUser);
    await saveRefreshToken(newUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        createdAt: newUser.createdAt,
        conversations: newUser.conversations,
        role: newUser.role,
        isGoogleUser: newUser.isGoogleUser,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  const startedAt = Date.now();
  const { ip, userAgent } = getRequestMeta(req);

  try {
    const { email, password } = req.body;
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const safeEmail = maskEmail(trimmedEmail);
    const trimmedPassword = typeof password === "string" ? password : "";

    // Validate input
    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user exists
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens and save refresh token
    const { accessToken, refreshToken } = await generateTokens(user);

    await saveRefreshToken(user._id, refreshToken);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
        cartItems: user.cartItems,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[AUTH][LOGIN] Unexpected error", {
      message: error?.message,
      stack: error?.stack,
      ip,
      userAgent,
      durationMs: Date.now() - startedAt,
    });
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "User already logged out" });
    }

    // Decode to get userId from token payload
    let userId;
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      userId = decoded.id;
    } catch (err) {
      // If token is invalid, treat as logout anyway
      console.warn("Invalid refresh token on logout");
    }

    // Delete the refresh token from Redis
    if (userId) {
      await redis.del(`refreshToken:${userId}`);
    }

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    // console.log("Cookies after clearing:", res.getHeaders());
    res.status(201).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Decode to get userId from token payload
    let userId;
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if the refresh token exists in Redis
    const storedRefreshToken = await redis.get(`refreshToken:${userId}`);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Generate new tokens
    // const { accessToken, newRefreshToken } = await generateTokens({ id: userId });
    // await saveRefreshToken(userId, newRefreshToken);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getProfile = async (req, res) => {
  try {
    // console.log("REQUEST: ", req);
    res.json(req.user);
    // console.log("USER REQUEST: ", req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
// IMPORTANT: For the 'auth-code' flow used with @react-oauth/google,
// the redirect_uri on the client side is 'postmessage'.
// This is critical for the server-side exchange.
const REDIRECT_URI = "postmessage";

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
);

export const googleAuth = async (req, res) => {
  try {
    // The frontend now sends the authorization code under the 'code' key
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    // Step 1: Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);

    const idToken = tokens.id_token; // <--- This is the ID Token (JWT)
    // const accessToken = tokens.access_token; // This is the Access Token

    if (!idToken) {
      return res
        .status(500)
        .json({ message: "ID Token not received from Google" });
    }

    // Step 2: Verify the ID Token
    // Now you are correctly passing the idToken (JWT) to verifyIdToken
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload; // Destructure for clarity

    // console.log("Google Auth Payload (from verified ID Token):", payload);

    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid Google token: No email found in payload" });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email });
    if (!user) {
      // Create new user if not exists
      user = new User({
        name: name,
        email: email,
        picture: picture,
        role: "customer", // Default role
        isGoogleUser: true, // Mark as Google user
      });

      // console.log("Creating new user:", user);
      await user.save();
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    await saveRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Google authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
        cartItems: user.cartItems,
        role: user.role,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    // Provide more specific error messages if helpful for debugging
    if (error.code === "EENVELOPE") {
      // Specific error for invalid JWT structure
      res.status(401).json({
        message:
          "Invalid token format. Ensure you're sending the authorization code.",
      });
    } else if (error.message.includes("Wrong number of segments in token")) {
      res.status(401).json({
        message:
          "Backend received an Access Token or Authorization Code instead of an ID Token for verification.",
      });
    } else {
      res.status(500).json({
        message:
          "Server error. Google authentication failed. Please try again later.",
      });
    }
  }
};
