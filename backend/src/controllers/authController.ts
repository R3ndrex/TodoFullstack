import type { Request, Response } from "express";
import bcrypt from "bcrypt";

export default {
    login: (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        if (!username || password || !email)
            return res.status(400).json({
                message: "Username and password and email are required",
            });
    },
    register: (req: Request, res: Response) => {},
};
