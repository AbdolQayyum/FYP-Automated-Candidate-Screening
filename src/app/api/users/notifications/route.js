import { connect } from "@/dbConnection/dbConnection";
import Notification from "@/models/notificationModel"; 
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Connect to the database
connect();


function createErrorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token");

    if (!token || !token.value) {
      return createErrorResponse("Unauthorized: Token is missing.", 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
    } catch (error) {
      return createErrorResponse("Unauthorized: Invalid token.", 401);
    }

    const { id: candidateId } = decoded;

    if (!candidateId) {
      return createErrorResponse("Candidate ID missing.", 400);
    }

    const notifications = await Notification.find({ candidateId })
      .populate("jobTitle")
      .lean();

    if (!notifications || notifications.length === 0) {
      return createErrorResponse("No notifications found.", 404);
    }

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications: notifications,
    });

  } catch (error) {
    console.error("Error fetching notifications:", error); // Log error details to the console
    return createErrorResponse("Internal server error: " + error.message, 500);
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token");

    if (!token || !token.value) {
      return NextResponse.json({ error: "Unauthorized: Token is missing." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.TOKEN_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token." }, { status: 401 });
    }

    const { id: candidateId } = decoded;

    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID missing." }, { status: 400 });
    }

    // Update notifications as read
    await Notification.updateMany(
      { candidateId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}