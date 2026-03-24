import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  section: {
    type: String,
    default: 'A'
  },
  room: {
    type: String,
    default: '101'
  }
}, { timestamps: true });

export default mongoose.model('Class', classSchema);
