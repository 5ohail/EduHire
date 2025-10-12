import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "Student" | "Mentor" | "Recruiter" | "PlacementCell";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  phone?: string;
  bio?: string;
  education?: {
    college: string;
    degree: string;
    branch: string;
    startYear: number;
    endYear: number;
  }[];
  skills?: string[];
  internships?: {
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
    description?: string;
  }[];
  projects?: {
    title: string;
    description: string;
    link?: string;
  }[];
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["Student", "mentor", "recruiter", "placement cell"], default: "Student", required: true },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    bio: { type: String, trim: true },
    education: [
      {
        college: { type: String },
        degree: { type: String },
        branch: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    skills: { type: [String], default: [] },
    internships: [
      {
        title: { type: String },
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        link: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
