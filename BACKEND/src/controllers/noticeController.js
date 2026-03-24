import Notice from '../models/Notice.js';

export const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      senderId: req.user._id
    });
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
};

export const getNotices = async (req, res, next) => {
  try {
    const { role } = req.user;
    const notices = await Notice.find({
      $or: [{ targetRoles: role }, { targetRoles: [] }]
    }).sort({ createdAt: -1 }).populate('senderId', 'name role');
    res.json(notices);
  } catch (error) {
    next(error);
  }
};

export const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('senderId', 'name role');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    next(error);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('senderId', 'name role');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};
