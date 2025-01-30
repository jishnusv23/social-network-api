import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract the token from the cookies
    const token = req.cookies.access_token;

    console.log("🚀 ~ file: auth.middleware.ts:24 ~ token:", token);

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    // Check if the decoded token has the required fields
    if (!decoded.userId || !decoded.email) {
      res
        .status(401)
        .json({ success: false, message: "Invalid token structure" });
      return;
    }

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
