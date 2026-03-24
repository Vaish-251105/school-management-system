import mongoose from 'mongoose';

const staffAttendanceSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

export default mongoose.model("StaffAttendance", staffAttendanceSchema);
