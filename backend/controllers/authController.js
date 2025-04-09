import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

export const userRegisteration = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      const error = new Error('All fields are required');
      error.status = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const error = new Error('Email already in use');
      error.status = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      const error = new Error('All fields are required');
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};
