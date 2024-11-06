// /app/api/hr/hrlogin/route.js
import connectMongo from '@/dbConnection/dbConnection';
import HRUser from '@/models/hrModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, key } = await req.json(); // Extract JSON body

    await connectMongo(); // Connect to MongoDB
    const user = await HRUser.findOne({ username, key });

    if (user) {
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Credentials do not match' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
