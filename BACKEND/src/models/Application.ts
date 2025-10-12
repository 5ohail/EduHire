import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';
  appliedDate: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobPosting', required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Interview', 'Rejected', 'Hired'], default: 'Pending' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);


