import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  jobTitle: {
    type: String,
    required: true, 
  },
  title: {
    type: String, 
    required: true,
  },
  message: {
    type: String, 
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date, 
    required: true,
  },
  endTime: {
    type: Date, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
