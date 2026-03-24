import Expense from '../models/Expense.js';

export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      addedBy: req.user._id
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }).populate('addedBy', 'name');
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    next(error);
  }
};
