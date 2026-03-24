import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['Tuition', 'Exam', 'Transport', 'Uniform', 'Other'],
    default: 'Tuition'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  transactionId: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);
