import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// @desc    Get or create user's chat
// @route   GET /api/chats/my-chat
// @access  Private (User)
export const getUserChat = async (req, res, next) => {
    try {
        let chat = await Chat.findOne({ user: req.user._id }).populate('lastMessage');

        if (!chat) {
            chat = await Chat.create({ user: req.user._id });
        }

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        // Only allow if it's the user's own chat or if they are admin/support/agent
        if (chat.user.toString() !== req.user._id.toString() && !['admin', 'support', 'agent'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
        }

        const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).populate('sender', 'name role avatar');

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        // Only allow if it's the user's own chat or if they are admin/support/agent
        if (chat.user.toString() !== req.user._id.toString() && !['admin', 'support', 'agent'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized to send to this chat' });
        }

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: 'Please provide message text' });
        }

        const message = await Message.create({
            chat: chat._id,
            sender: req.user._id,
            text,
        });

        chat.lastMessage = message._id;

        // Auto-assign to whoever replies from support side if unassigned
        if (['admin', 'support', 'agent'].includes(req.user.role) && !chat.assignedTo) {
            chat.assignedTo = req.user._id;
        }

        if (chat.status === 'closed') chat.status = 'open'; // reopen if someone replies

        await chat.save();

        const populatedMessage = await message.populate('sender', 'name role avatar');

        res.status(201).json({
            success: true,
            data: populatedMessage,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all chats (for support dashboard)
// @route   GET /api/chats
// @access  Private (Admin, Support, Agent)
export const getAllChats = async (req, res, next) => {
    try {
        const chats = await Chat.find()
            .populate('user', 'name email avatar')
            .populate('assignedTo', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: chats.length,
            data: chats,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign chat to self
// @route   PUT /api/chats/:id/assign
// @access  Private (Admin, Support, Agent)
export const assignChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        chat.assignedTo = req.user._id;
        chat.status = 'in-progress';
        await chat.save();

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Close chat
// @route   PUT /api/chats/:id/close
// @access  Private (Admin, Support, Agent)
export const closeChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        chat.status = 'closed';
        await chat.save();

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};
