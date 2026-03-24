import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examName: {
    type: String,
    required: true // e.g., 'Mid-term', 'Final'
  },
  subject: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('ExamResult', examResultSchema);
