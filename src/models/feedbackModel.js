import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  candidateId: { type: String, required: true }, // Candidate's unique ID
  candidateName: { type: String, required: true }, // Candidate's name
  email: { type: String, required: true }, // Candidate's email
  jobTitle: { type: String, required: true }, // Job title
  totalQuestions: { type: Number, required: true }, // Total number of questions
  correctAnswers: { type: Number, required: true }, // Number of correct answers
  createdAt: { type: Date, default: Date.now }, // Timestamp for feedback creation
  notificationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Notification', 
    required: true // Reference to the Notification model
  },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
