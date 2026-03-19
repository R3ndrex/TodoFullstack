import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/index.js";

export default {
    deleteTodo: async (req: Request, res: Response) => {
        const userId = req.userId;
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "Id is required" });

        const todo = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        if (todo.userId !== userId)
            return res.status(403).json({ message: "Forbidden" });

        await prisma.todo.delete({ where: { id: Number(id) } });

        return res.status(200).json({ message: "Deleted" });
    },
    findTodos: async (req: Request, res: Response) => {
        const userId = req.userId;
        const { done } = req.query;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const filter: Prisma.TodoWhereInput = { userId };
        if (done === "true") filter.done = true;
        if (done === "false") filter.done = false;

        const todos = await prisma.todo.findMany({ where: filter });
        return res.status(200).json(todos);
    },
    createTodo: async (req: Request, res: Response) => {},
    updateTodo: async (req: Request, res: Response) => {},
};
