import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.modal.js";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent Javascript to access cookies
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time -> 7 days
    });

    return res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent Javascript to access cookies
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time -> 7 days
    });

    return res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    })
  }
}

// Is Authenticated
export const isAuth = async (req, res) => {
  try {


    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    })
  }
}

// logout User
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    })
  }
}