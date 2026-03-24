import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverPhone: {
    type: String,
    required: true,
  },
  route: {
    type: String, // e.g. "Main City - High School"
    required: true,
  },
  currentLat: Number,
  currentLng: Number,
  status: {
    type: String,
    enum: ["In Transit", "Reached", "Wait"],
    default: "Wait",
  },
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
