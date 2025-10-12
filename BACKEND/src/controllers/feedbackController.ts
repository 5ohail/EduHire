import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Feedback } from '../models/Feedback';

export const listFeedback = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Feedback.find().sort({ feedbackDate: -1 }).limit(100);
  res.status(200).json({ success: true, data: items });
});

export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, studentName, topic, company, rating, comments, reviewer } = req.body as {
    studentId?: string; studentName?: string; topic?: string; company?: string; rating?: number; comments?: string; reviewer?: string;
  };
  if (!studentId || !studentName || !topic || !company || !rating || !comments) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const item = await Feedback.create({ studentId, studentName, topic, company, rating, comments, reviewer });
  res.status(201).json({ success: true, data: item });
});


