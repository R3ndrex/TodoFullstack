import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

const setTokenCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export default {
    login: async (req: Request, res: Response) => {
        if (!ACCESS_SECRET || !REFRESH_SECRET) {
            throw new Error("Access token secret is not defined");
        }
        const { name, password, email } = req.body;
        if (!name || !password || !email)
            return res.status(400).json({
                message: "Username and password and email are required",
            });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
            expiresIn: "7d",
        });

        setTokenCookies(res, accessToken, refreshToken);

        return res
            .status(200)
            .json({ id: user.id, name: user.name, email: user.email });
    },
    register: async (req: Request, res: Response) => {
        if (!ACCESS_SECRET || !REFRESH_SECRET) {
            throw new Error("Access token secret is not defined");
        }
        const { name, password, email } = req.body;
        if (!name || !password || !email) {
            return res.status(400).json({
                message: "Username and password and email are required",
            });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
            expiresIn: "7d",
        });

        setTokenCookies(res, accessToken, refreshToken);

        return res
            .status(200)
            .json({ id: user.id, name: user.name, email: user.email });
    },
    logout: (_req: Request, res: Response) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out" });
    },
};
