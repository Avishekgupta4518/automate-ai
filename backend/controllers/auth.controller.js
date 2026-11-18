import { app } from "../config/firebase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { token: firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        message: "Token not found",
      });
    }

    // Verify Firebase ID token
    const decoded = await getAuth(app).verifyIdToken(firebaseToken);

    // Find or create user in MongoDB
    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          name: decoded.name || decoded.email?.split("@")[0] || "User",
          email: decoded.email,
          profilePicture: decoded.picture || "",
        },
        $setOnInsert: {
          firebaseUid: decoded.uid,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Logout error",
      error: error.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Me Error:", error);

    return res.status(500).json({
      message: `Me error: ${error.message}`,
    });
  }
};
