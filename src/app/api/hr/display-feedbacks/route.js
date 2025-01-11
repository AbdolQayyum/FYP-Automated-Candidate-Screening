import Notification from "@/models/notificationModel"; // Notification schema
import Feedback from "@/models/feedbackModel"; // Feedback schema

export async function GET(req) {
  try {
    // Fetch all notifications
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 }) // Sort notifications by creation date
      .lean();

    // Fetch all feedbacks
    const feedbacks = await Feedback.find({}).lean();

    // Map feedbacks by notificationId for quick lookup
    const feedbackMap = feedbacks.reduce((map, feedback) => {
      map[feedback.notificationId.toString()] = feedback;
      return map;
    }, {});

    // Merge notifications with their feedback
    const enrichedNotifications = notifications.map((notification) => ({
      ...notification,
      feedback: feedbackMap[notification._id.toString()] || null, // Attach feedback using notificationId
    }));

    console.log("Enriched Notifications:", enrichedNotifications);

    return new Response(JSON.stringify({ notifications: enrichedNotifications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching notifications or feedbacks:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch notifications or feedbacks" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
