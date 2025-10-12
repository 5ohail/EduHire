import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJobPosting extends Document {
  facultyId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  description: string;
  minCGPA: number;
  requiredSkills: string[];
  status: 'Open' | 'Closed';
}

const JobPostingSchema = new Schema<IJobPosting>(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    minCGPA: { type: Number, default: 0 },
    requiredSkills: { type: [String], default: [] },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
);

export const JobPosting: Model<IJobPosting> = mongoose.models.JobPosting || mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);


