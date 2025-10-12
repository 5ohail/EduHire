import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User, UserRole } from '../models/User';
import { signJwt } from '../utils/jwt';

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body as {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'username, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  // Map input role to enum
  const roleMap: Record<string, UserRole> = {
    student: 'Student',
    mentor: 'Mentor',
    recruiter: 'Recruiter',
    'placement cell': 'PlacementCell',
  };

  const finalRole: UserRole = role ? roleMap[role.toLowerCase()] || 'Student' : 'Student';

  const user = await User.create({
    name: username,
    username,
    email,
    password,
    role: finalRole,
  });

  const token = signJwt({ id: user._id.toString(), role: user.role, email: user.email });

  return res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

// LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signJwt({ id: user._id.toString(), role: user.role, email: user.email });
  return res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

// GET CURRENT USER
export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.status(200).json({ success: true, data: user });
});

// UPDATE CURRENT USER
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { title, college, phone, skills, name } = req.body as {
    title?: string;
    college?: string;
    phone?: string;
    skills?: string[];
    name?: string;
  };

  const update: any = {};
  if (typeof name === 'string') update.name = name;
  if (typeof title === 'string') update.title = title;
  if (typeof college === 'string') update.college = college;
  if (typeof phone === 'string') update.phone = phone;
  if (Array.isArray(skills)) update.skills = skills.filter(s => typeof s === 'string');

  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.status(200).json({ success: true, data: user });
});
