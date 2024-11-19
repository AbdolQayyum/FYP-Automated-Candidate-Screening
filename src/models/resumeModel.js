import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  fileName: { type: String, required: true },
  s3Url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
