import { z } from "zod";
import AppError from "../utils/AppError.js";
import validateInput from "../utils/validateInput.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../user/user.model.js";

dotenv.config();

class AuthService {
  async signup(data, file) {
    if (file) {
      data.avatarUrl = `http://localhost:4000/${file.path}`;
    } else {
      data.avatarUrl = null;
    }
    data.status = "Offline";
    data.role = "user";
    const userSchema = z.object({
      username: z.string(),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      avatarUrl: z.string().url("Invalid URL format").optional().nullable(),
      status: z.enum(["Online", "Offline"]).default("Offline").optional(),
      role: z.literal("user").default("user").optional(),
    });

    const validatedUser = validateInput(userSchema, data);

    const existingEmail = await User.findOne({ email: validatedUser.email });
    const existingUsername = await User.findOne({
      username: validatedUser.username,
    });
    if (existingEmail)
      throw new AppError("User already exists with this email", 400);
    if (existingUsername)
      throw new AppError("User already exists with this username", 400);

    validatedUser.password = await bcrypt.hash(validatedUser.password, 12);
    const newUser = await User.create(validatedUser);

    return newUser;
  }

  async login(data, res) {
    const userSchema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string(),
    });

    const validatedUser = validateInput(userSchema, data);

    let user = await User.findOne({ email: validatedUser.email });
    if (!user) throw new AppError("Invalid credentials", 400);

    const isPasswordCorrect = await bcrypt.compare(
      validatedUser.password,
      user.password
    );
    if (!isPasswordCorrect) throw new AppError("Invalid credentials", 400);

    user = await User.findOneAndUpdate(
      { email: validatedUser.email },
      { status: "Online" },
      { new: true }
    );
    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    });

    return user;
  }

  async logout(req, res) {
    const token = req.cookies.token;
    if (!token) throw new AppError("User is not logged in", 400);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decodedToken.id, { status: "Offline" });

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return "Logged out successfully";
  }

  async authorize(req) {
    const token = req.cookies.token;
    if (!token) throw new AppError("User is not logged in", 401);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) throw new AppError("User not found", 404);

    return user;
  }
}

export default new AuthService();
