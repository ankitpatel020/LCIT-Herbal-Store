import express from 'express';
import {
    getUserChat,
    getChatMessages,
    sendMessage,
    getAllChats,
    assignChat,
    closeChat
} from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Routes for normal users
router.route('/my-chat').get(protect, getUserChat);
router.route('/:id/messages').get(protect, getChatMessages).post(protect, sendMessage);

// Routes for support/admin/agent
router.route('/').get(protect, authorize('admin', 'agent', 'support'), getAllChats);
router.route('/:id/assign').put(protect, authorize('admin', 'agent', 'support'), assignChat);
router.route('/:id/close').put(protect, authorize('admin', 'agent', 'support'), closeChat);

export default router;
