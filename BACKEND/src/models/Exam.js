import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
