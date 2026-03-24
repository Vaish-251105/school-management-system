import Message from '../models/Message.js';

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, message } = req.body;
    const senderId = req.user._id;

    if (!recipientId || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (senderId.toString() === recipientId.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const newMessage = await Message.create({
      sender: senderId,
      recipient: recipientId,
      subject,
      message,
    }).populate('sender', 'name email role').populate('recipient', 'name email role');

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inbox (messages received)
export const getInbox = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    const skip = (page - 1) * limit;
    let filter = { recipient: recipientId };

    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const messages = await Message.find(filter)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(filter);

    res.json({
      messages,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sent messages
export const getSentMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await Message.find({ sender: senderId })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ sender: senderId });

    res.json({
      messages,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single message
export const getSingleMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read if recipient is viewing
    if (message.recipient._id.toString() === req.user._id.toString() && !message.isRead) {
      message.isRead = true;
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).populate('sender', 'name email role').populate('recipient', 'name email role');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const recipientId = req.user._id;

    const count = await Message.countDocuments({
      recipient: recipientId,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
