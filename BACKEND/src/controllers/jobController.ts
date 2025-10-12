import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { JobPosting } from '../models/JobPosting';

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const job = await JobPosting.findById(id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.status(200).json({ success: true, data: job });
});

export const getOpenJobs = asyncHandler(async (req: Request, res: Response) => {
  const { minCGPA, skill } = req.query as { minCGPA?: string; skill?: string };
  const filter: Record<string, unknown> = { status: 'Open' };
  if (minCGPA) filter.minCGPA = { $lte: Number(minCGPA) };
  if (skill) filter.requiredSkills = { $in: [skill] };

  const jobs = await JobPosting.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: jobs });
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { title, company, description, minCGPA = 0, requiredSkills = [] } = req.body as {
    title?: string; company?: string; description?: string; minCGPA?: number; requiredSkills?: string[];
  };
  if (!title || !company || !description) {
    return res.status(400).json({ success: false, message: 'title, company, and description are required' });
  }
  const job = await JobPosting.create({
    facultyId: req.user.id,
    title,
    company,
    description,
    minCGPA,
    requiredSkills,
  });
  res.status(201).json({ success: true, data: job });
});

export const updateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { id } = req.params;
  const { status } = req.body as { status?: 'Open' | 'Closed' };
  if (!status) return res.status(400).json({ success: false, message: 'status is required' });
  const job = await JobPosting.findByIdAndUpdate(id, { status }, { new: true });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.status(200).json({ success: true, data: job });
});


