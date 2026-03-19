import { Router } from "express";
import todosController from "../controllers/todosController.js";
const todoRouter = Router();

todoRouter.get("/", todosController.findTodos);
todoRouter.post("/", todosController.createTodo);
todoRouter.delete("/", todosController.deleteTodo);
todoRouter.put("/", todosController.updateTodo);

export default todoRouter;
