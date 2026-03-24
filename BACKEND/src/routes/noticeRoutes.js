import express from "express";
const router = express.Router();
import { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice } from "../controllers/noticeController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createNotice);
router.get("/", protect, getNotices);
router.get("/:id", protect, getNoticeById);
router.put("/:id", protect, updateNotice);
router.delete("/:id", protect, deleteNotice);

export default router;
