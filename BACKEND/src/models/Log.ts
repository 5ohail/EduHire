import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
  userId?: mongoose.Types.ObjectId;
  timeSpentHours: number; // store as hours (e.g., 1.5)
  type: 'Work' | 'Meeting' | 'Research' | 'Review';
  taskTicket?: string;
  comment?: string;
  createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema<ILog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  timeSpentHours: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['Work', 'Meeting', 'Research', 'Review'], required: true },
  taskTicket: { type: String },
  comment: { type: String },
}, { timestamps: { createdAt: true, updatedAt: true } });

export const LogModel: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default LogModel;


