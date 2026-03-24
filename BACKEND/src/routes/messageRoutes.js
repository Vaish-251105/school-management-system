import express from 'express';
import {
  sendMessage,
  getInbox,
  getSentMessages,
  getSingleMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All message routes require authentication
router.use(protect);

// Send message
router.post('/', sendMessage);

// Get inbox
router.get('/inbox', getInbox);

// Get sent messages
router.get('/sent', getSentMessages);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get single message
router.get('/:id', getSingleMessage);

// Mark message as read
router.put('/:id/read', markAsRead);

// Delete message
router.delete('/:id', deleteMessage);

export default router;
