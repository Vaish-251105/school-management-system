import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  content: {
    type: String, // Can be text or fileUrl
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  grade: String,
  remarks: String,
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
