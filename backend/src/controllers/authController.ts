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
        const { username, password, email } = req.body;
        if (!username || password || !email)
            return res.status(400).json({
                message: "Username and password and email are required",
            });
    },
    register: async (req: Request, res: Response) => {
        if (!ACCESS_SECRET || !REFRESH_SECRET) {
            throw new Error("Access token secret is not defined");
        }
        const { name, password, email } = req.body;
        if (!name || password || !email)
            return res.status(400).json({
                message: "Username and password and email are required",
            });

        const existingUser = await prisma.user.findMany();
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        const hashedPassword = bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password },
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
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out" });
    },
};
