import Homework from '../models/Homework.js';

export const createHomework = async (req, res, next) => {
  try {
    const homework = await Homework.create({
      ...req.body,
      teacherId: req.user._id
    });
    res.status(201).json(homework);
  } catch (error) {
    next(error);
  }
};

export const getAllHomework = async (req, res, next) => {
  try {
    const { class: className, subject } = req.query;
    let filter = {};
    if (className) filter.class = className;
    if (subject) filter.subject = subject;

    const homeworks = await Homework.find(filter).populate('teacherId', 'name');
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
};

export const getHomeworkById = async (req, res, next) => {
  try {
    const homework = await Homework.findById(req.params.id).populate('teacherId', 'name');
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }
    res.json(homework);
  } catch (error) {
    next(error);
  }
};

export const updateHomework = async (req, res, next) => {
  try {
    const homework = await Homework.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(homework);
  } catch (error) {
    next(error);
  }
};

export const deleteHomework = async (req, res, next) => {
  try {
    await Homework.findByIdAndDelete(req.params.id);
    res.json({ message: "Homework deleted" });
  } catch (error) {
    next(error);
  }
};
