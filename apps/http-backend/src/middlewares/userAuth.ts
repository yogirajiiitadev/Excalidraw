import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";
// Extend Express Request to include userId
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Add user info to request
}

export const userAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1] ?? ""; // Extract Bearer token

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Define token payload type
    // @ts-ignore
    req.user = { userId: decoded.userId }; // Attach user info to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
