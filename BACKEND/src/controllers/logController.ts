import { Request, Response } from 'express';
import LogModel from '../models/Log';

export async function listLogs(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    const filter: any = {};
    if (userId) filter.userId = userId;
    const logs = await LogModel.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
}

export async function createLog(req: Request, res: Response) {
  try {
    const { userId, timeSpentHours, type, taskTicket, comment } = req.body;
    if (typeof timeSpentHours !== 'number' || timeSpentHours < 0) {
      return res.status(400).json({ message: 'timeSpentHours must be a positive number' });
    }
    const log = await LogModel.create({ userId, timeSpentHours, type, taskTicket, comment });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create log' });
  }
}

export async function deleteLog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await LogModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Log not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete log' });
  }
}


