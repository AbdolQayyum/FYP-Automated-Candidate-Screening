import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/lib/mailer';


// connect function which can be made in dbConnection file that can connect with database
connect();

/**
 * Handles the POST request.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */

export async function POST(request) {
  try {
    // In express we need some middlewares, but in Next.js we need nothing
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validation
    console.log(reqBody);

    // Check if user already exists with a more specific query
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User Already exists" }, { status: 400 });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error('Failed to save user to database');
    }

    console.log(savedUser);

    // Handle potential undefined savedUser
    if (!savedUser) {
      console.error('Error: User not saved. Could not send verification email.');
      return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
    }

    
    // Send verification email
await sendEmail({ email: savedUser.email, emailType: 'VERIFY', userId: savedUser._id });


    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
