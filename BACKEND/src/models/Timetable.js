import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  periods: [{
    subject: String,
    startTime: String,
    endTime: String,
    teacher: String,
    room: String
  }]
}, { timestamps: true });

export default mongoose.model('Timetable', timetableSchema);
