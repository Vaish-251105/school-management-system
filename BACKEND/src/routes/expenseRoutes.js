import express from "express";
const router = express.Router();
import { createExpense, getExpenses, deleteExpense } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);

export default router;
