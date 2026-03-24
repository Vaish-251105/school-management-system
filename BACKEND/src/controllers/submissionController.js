import Submission from '../models/Submission.js';
import Homework from '../models/Homework.js';

export const submitHomework = async (req, res) => {
  try {
    const { homeworkId, content } = req.body;
    const submission = new Submission({
      homeworkId,
      studentId: req.user.studentId || req.user._id, // Depends on how studentId is stored in User
      content,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { homeworkId } = req.query;
    let query = {};
    if (homeworkId) query.homeworkId = homeworkId;
    
    const submissions = await Submission.find(query)
      .populate('studentId', 'name')
      .populate('homeworkId', 'title');
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { grade, remarks } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, remarks },
      { new: true }
    );
    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
