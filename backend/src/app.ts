import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import todoRouter from "./routes/todosRoute.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/auth.js";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/todos", authMiddleware, todoRouter);

app.use((_, res) => {
    res.status(404).send("404");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message);
});
app.listen(process.env.PORT, (error) => {
    if (error) throw error;
    else {
        console.log(`listening on port ${process.env.PORT}`);
    }
});
