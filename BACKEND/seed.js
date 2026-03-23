import mongoose from 'mongoose';
import User from './src/models/User.js';
import Teacher from './src/models/Teacher.js';
import Student from './src/models/Student.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

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
        await Teacher.create({ userId: user._id, subject: 'Math', qualification: 'PhD', experience: 10 });
      }
      if (role === 'student') {
        await Student.create({ userId: user._id, class: '10', section: 'A', rollNumber: 101 });
      }

      console.log(`✅ ${role.toUpperCase()} Created: ${email} / 123`);
    }

    console.log('\n🌟 ALL ACCOUNTS READY (Incl. Accountant)!');
    process.exit(0);
  } catch (err) {
    console.error('SEEDING FAILED:', err.message);
    process.exit(1);
  }
};

seed();
