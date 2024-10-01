import { connect } from '@/dbConnection/dbConnection'; 
import Job from '@/models/jobspostingModel';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const body = await request.json();

    // Destructure the incoming data, expecting salaryRange with min and max fields
    const { title, location, salaryMin, salaryMax, type, description, requirements, responsibilities } = body;

    // Validate required fields
    if (!title || !location || !salaryMin || !salaryMax || !type || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new job
    const newJob = new Job({
      title,
      location,
      salaryRange: { min: salaryMin, max: salaryMax },
      type,
      description,
      requirements: requirements || [],  // Default to empty array if not provided
      responsibilities: responsibilities || [],  // Default to empty array if not provided
    });

    // Save the job to the database
    const savedJob = await newJob.save();

    // Return the saved job in the response
    return NextResponse.json({ success: true, data: savedJob }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    
    await connect();

    const url = new URL(request.url);
    const jobId = url.searchParams.get('id');  

    let jobs;

    if (jobId) {
    
      jobs = await Job.findById(jobId);
      if (!jobs) {
        return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
      }
    } else {
      
      jobs = await Job.find({});
    }

    
    return NextResponse.json({ success: true, data: jobs }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
