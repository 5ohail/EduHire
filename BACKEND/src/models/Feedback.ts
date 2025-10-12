import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  topic: 'Interview Performance' | 'Internship Review' | 'Technical Assessment' | 'Soft Skills';
  company: string;
  rating: number;
  comments: string;
  reviewer: string;
  feedbackDate: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    topic: { type: String, enum: ['Interview Performance', 'Internship Review', 'Technical Assessment', 'Soft Skills'], required: true },
    company: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, required: true },
    reviewer: { type: String, default: 'Placement Officer' },
    feedbackDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);


