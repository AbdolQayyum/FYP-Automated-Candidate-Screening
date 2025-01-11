import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true,
    index: true, 
  },
  jobTitle: {
    type: String,
    required: true, 
  },
  fileName: {
    type: String,
    required: true,
  },
  s3Url: {
    type: String, 
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  candidateName: {
    type: String,
    required: true,
    trim: true, // Trim spaces from candidate's name
  },
  email: {
    type: String,
    required: true,
  },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
});

// Compound index to prevent duplicate resumes for the same job and candidate
ResumeSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// Middleware for logging resume upload (optional)
ResumeSchema.pre('save', function (next) {
  console.log(`A new resume for jobId: ${this.jobId} is being uploaded by ${this.candidateName}`);
  next();
});

// Export the model
export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
