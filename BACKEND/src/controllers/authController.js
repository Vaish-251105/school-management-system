import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Create role-specific records
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        class: '10',
        section: 'A',
        rollNumber: Math.floor(Math.random() * 1000) + 1
      });
    } else if (role === 'teacher') {
      await Teacher.create({
        userId: user._id,
        subject: 'General',
        qualification: 'B.Ed',
        experience: 5
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    console.log(`LOGIN ATTEMPT: Email - "${email}", Password - "${password}"`);
    let user = await User.findOne({ email });

    // MASTER PASS AUTO-LOGIN / AUTO-REGISTER
    if (!user && password === '123') {
      console.log('AUTO-REGISTERING GUEST USER:', email);
      user = await User.create({
        name: email.split('@')[0],
        email: email,
        password: await bcrypt.hash('123', 10),
        role: 'student' // Default role for auto-registered users
      });
    }

    if (!user) {
      console.log('USER NOT FOUND:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = (password === '123') || (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      console.log('PASSWORD MISMATCH for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    console.log('LOGIN SUCCESS:', email);
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { register, login };

