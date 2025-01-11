import { connect } from '@/dbConnection/dbConnection';
import Feedback from '@/models/feedbackModel'; // Feedback model schema
import Notification from '@/models/notificationModel'; // Notification model schema
import { NextResponse } from 'next/server';

connect();

export async function POST(req) {
  try {
    const feedbackData = await req.json();

    // Validate required fields
    const requiredFields = [
      'candidateId',
      'candidateName',
      'email',
      'jobTitle',
      'totalQuestions',
      'correctAnswers',
    ];

    for (const field of requiredFields) {
      if (!feedbackData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Find the corresponding notification for the candidate
    const notification = await Notification.findOne({ candidateId: feedbackData.candidateId });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found for the candidate' },
        { status: 404 }
      );
    }

    // Create a new feedback document
    const feedback = new Feedback({
      candidateId: feedbackData.candidateId,
      candidateName: feedbackData.candidateName,
      email: feedbackData.email,
      jobTitle: feedbackData.jobTitle,
      totalQuestions: feedbackData.totalQuestions,
      correctAnswers: feedbackData.correctAnswers,
      notificationId: notification._id, // Link to the notification
      createdAt: new Date(),
    });

    await feedback.save();

    return NextResponse.json({ message: 'Feedback saved successfully', success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
