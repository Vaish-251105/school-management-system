import Fee from '../models/Fee.js';

export const createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
};

export const getStudentFees = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const fees = await Fee.find({ studentId }).sort({ dueDate: 1 });
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
