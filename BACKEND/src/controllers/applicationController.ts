import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Application } from '../models/Application';
import { JobPosting } from '../models/JobPosting';
import { User } from '../models/User';

// POST /api/applications/applied { email }
export const getAppliedApplications = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ success: false, message: 'email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const applications = await Application.find({ studentId: user._id })
    .populate('jobId')
    .sort({ createdAt: -1 });

  const response = applications.map((app) => ({
    internship: (app as any).jobId?.title || 'N/A',
    company: (app as any).jobId?.company || 'N/A',
    status: app.status,
    applicationDate: app.appliedDate,
  }));

  res.status(200).json({ success: true, applications: response });
});

// GET /api/applications/analytics (simple aggregated counts)
export const getApplicationsAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const total = await Application.countDocuments();
  const byStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const stats: Record<string, number> = {};
  byStatus.forEach((s) => { stats[s._id as string] = s.count as number; });

  // Minimal structure matching the dashboard needs
  res.status(200).json({ success: true, total, byStatus: stats });
});


