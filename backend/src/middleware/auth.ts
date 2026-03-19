import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function auth(req: Request, res: Response, next: NextFunction) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const token = req.cookies?.accessToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const payload = jwt.verify(token, ACCESS_SECRET) as { userId: number };
        (req as any).userId = payload.userId;
        next();
    } catch {
        return res
            .status(401)
            .json({ message: "Invalid or expired access token" });
    }
}
export default auth;
