import mongoose from 'mongoose';
import User from './src/models/User.js';
import Teacher from './src/models/Teacher.js';
import Student from './src/models/Student.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

import Assistant from './src/models/User.js'; // Just to get models
import Homework from './src/models/Homework.js';
import Fee from './src/models/Fee.js';
import Notice from './src/models/Notice.js';
import ExamResult from './src/models/ExamResult.js';

const roles = ['admin', 'teacher', 'student', 'parent', 'accountant'];
const password = '123';

const seed = async () => {
  try {
    console.log('CONNECTING TO:', process.env.MONGO_URI || 'LOCAL (school_db)');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_db');
    console.log('--- RESETTING DATABASE ---');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Wipe existing data
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Homework.deleteMany({});
    await Fee.deleteMany({});
    await Notice.deleteMany({});
    await ExamResult.deleteMany({});

    let teacherId, studentId, adminId;

    // Create all accounts
    for (const role of roles) {
      const email = `${role}@school.com`;
      const user = await User.create({
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} Test`,
        email: email,
        password: hashedPassword,
        role: role
      });

      if (role === 'teacher') {
        teacherId = user._id;
        await Teacher.create({ userId: user._id, subject: 'Mathematics', qualification: 'PhD', experience: 10 });
      }
      if (role === 'student') {
        studentId = user._id;
        await Student.create({ userId: user._id, class: '10', section: 'A', rollNumber: 101 });
      }
      if (role === 'admin') adminId = user._id;

      console.log(`✅ ${role.toUpperCase()} Created: ${email} / 123`);
    }

    // Add Homework
    if (teacherId) {
      await Homework.create({
        title: "Quadratic Equations",
        description: "Complete exercises 4.2 to 4.5 from the textbook.",
        subject: "Mathematics",
        class: "10",
        teacherId: teacherId,
        dueDate: new Date(Date.now() + 86400000 * 3) // 3 days later
      });
      console.log('✅ Homework Seeded');
    }

    // Add Notice
    if (adminId) {
      await Notice.create({
        title: "Winter Break Schedule",
        content: "School will remain closed from Dec 20 to Jan 5. Please return all library books.",
        senderId: adminId,
        targetRoles: ['student', 'teacher'],
        priority: 'high'
      });
      console.log('✅ Notice Seeded');
    }

    // Add Fees
    if (studentId) {
      await Fee.create({
        studentId: studentId,
        amount: 1200,
        type: 'Tuition',
        dueDate: new Date(Date.now() + 86400000 * 7),
        paid: false
      });
      await Fee.create({
        studentId: studentId,
        amount: 850,
        type: 'Uniform',
        dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
        paid: true,
        transactionId: "TXN12345678"
      });
      console.log('✅ Fees Seeded');
    }

    // Add Exam Results
    if (studentId) {
      await ExamResult.create({
        studentId: studentId,
        examName: "Final Term",
        subject: "Mathematics",
        marks: 85,
        totalMarks: 100,
        grade: "A",
        remarks: "Excellent progress."
      });
      await ExamResult.create({
        studentId: studentId,
        examName: "Final Term",
        subject: "Science",
        marks: 92,
        totalMarks: 100,
        grade: "A+",
        remarks: "Top performer."
      });
      console.log('✅ Exam Results Seeded');
    }


    console.log('\n🌟 ALL ACCOUNTS READY (Incl. Accountant)!');
    process.exit(0);
  } catch (err) {
    console.error('SEEDING FAILED:', err.message);
    process.exit(1);
  }
};

seed();
