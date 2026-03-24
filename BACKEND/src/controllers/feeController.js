import User from '../models/User.js';
import Fee from '../models/Fee.js';

export const createFee = async (req, res, next) => {
  try {
    const { studentId, ...feeData } = req.body;
    
    if (studentId) {
      const fee = await Fee.create({ ...feeData, studentId });
      return res.status(201).json(fee);
    }
    
    // Assign to ALL students if no studentId
    const students = await User.find({ role: 'student' });
    const fees = await Promise.all(students.map(s => 
      Fee.create({ ...feeData, studentId: s._id })
    ));
    
    res.status(201).json({ message: `Assigned to ${students.length} students`, fees });
  } catch (error) {
    next(error);
  }
};

export const getStudentFees = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'accountant');
    let fees;
    if (isAdmin && !req.params.studentId) {
      fees = await Fee.find().populate('studentId', 'name email').sort({ dueDate: 1 });
    } else {
      const studentId = req.params.studentId || req.user._id;
      fees = await Fee.find({ studentId }).populate('studentId', 'name email').sort({ dueDate: 1 });
    }
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

export const payFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;
    const fee = await Fee.findByIdAndUpdate(id, {
      paid: true,
      paidDate: new Date(),
      transactionId
    }, { new: true });
    res.json(fee);
  } catch (error) {
    next(error);
  }
};
