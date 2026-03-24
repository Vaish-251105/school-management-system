import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import testRoutes from './src/routes/testRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import teacherRoutes from './src/routes/teacherRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import staffAttendanceRoutes from './src/routes/staffAttendanceRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import homeworkRoutes from './src/routes/homeworkRoutes.js';
import submissionRoutes from './src/routes/submissionRoutes.js';
import examRoutes from './src/routes/examRoutes.js';
import busRoutes from './src/routes/busRoutes.js';
import feeRoutes from './src/routes/feeRoutes.js';
import noticeRoutes from './src/routes/noticeRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import timetableRoutes from './src/routes/timetableRoutes.js';
import classRoutes from './src/routes/classRoutes.js';

import { errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});
app.use(helmet());

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/staff-attendance', staffAttendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/classes', classRoutes);


app.use(errorHandler);

// Test routes
app.get('/', (req, res) => {
  res.send('School Management System API running');
});

app.get("/api/test-global", (req, res) => {
  res.json({
    message: "API working properly ✅"
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_db')
  .then(async () => {
    console.log('✅ MongoDB connected');
    const User = (await import('./src/models/User.js')).default;
    const users = await User.find({}, 'email role');
    console.log('DB USERS FOUND:', JSON.stringify(users));
  })
  .catch(err => console.error('❌ Mongo error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET missing in .env, defaulting to 'fallback_secret' for development.");
}
