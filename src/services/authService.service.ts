import { Authentication, UserEntities } from "@/types/Authentication";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { loginInter } from "@/utils/login.validation";
export class AuthServices {
  generateJWT(user: Authentication) {
    return jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
  }
  async registeruser(data: Authentication): Promise<UserEntities> {
    try {
      const { email, password, name } = data;
      console.log(
        "🚀 ~ file: authService.service.ts:15 ~ authServices ~ registeruser ~ data:",
        data
      );
      const existingUser = await User.findOne({ email });
      console.log(
        "🚀 ~ file: authService.service.ts:20 ~ AuthServices ~ registeruser ~ existingUser:",
        existingUser
      );
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        isActive: true,
      });
      console.log(
        "🚀 ~ file: authService.service.ts:26 ~ authServices ~ registeruser ~ user:",
        user
      );
      const token = this.generateJWT(user);

      return user;
    } catch (error) {
      console.error("somethin wrong in register", error);
      throw error;
    }
  }
  async loginUser(data: loginInter) {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    return user
  }
}
