import { connect } from "@/dbConnection/dbConnection";  
import Notification from "@/models/notificationModel";
import { NextResponse } from "next/server";

// Connect to the database
connect();

export async function POST(req) {
  try {
    const { candidateId, jobTitle, duration, startTime, endTime, message, title } = await req.json();

    // Validate required fields
    if (!candidateId || !jobTitle || !duration || !startTime || !endTime || !message || !title) {
      console.error("Missing required fields in the payload.");
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Create a new notification entry
    const newNotification = new Notification({
      candidateId,
      jobTitle,
      duration,
      startTime,
      endTime,
      message,
      title,
      createdAt: new Date(),
    });

    // Save the notification to the database
    await newNotification.save();

    console.log("Notification saved successfully:", newNotification);

    // Respond with success
    return NextResponse.json({ success: true, message: "Notification sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in sending notification:", error.message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
