import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'pending'],
      default: 'unpaid',
    },
    paidDate: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Salary', salarySchema);
