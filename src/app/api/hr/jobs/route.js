import { connect } from '@/dbConnection/dbConnection'; 
import Job from '@/models/jobspostingModel';
import { NextRequest, NextResponse } from 'next/server';

// POST: Create a new job
export async function POST(request) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const body = await request.json();

    // Destructure the incoming data
    const { title, location, salaryMin, salaryMax, type, description, requirements, responsibilities } = body;

    // Validate required fields
    if (!title || !location || !salaryMin || !salaryMax || !type || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Additional validation: Ensure salaryMin is less than salaryMax
    if (salaryMin > salaryMax) {
      return NextResponse.json({ success: false, message: 'Salary minimum should be less than maximum' }, { status: 400 });
    }

    // Create a new job instance
    const newJob = new Job({
      title,
      location,
      salaryRange: { min: salaryMin, max: salaryMax },
      type,
      description,
      requirements: requirements || [],  
      responsibilities: responsibilities || [],
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

// GET: Retrieve job(s)
export async function GET(request) {
  try {
    // Connect to the database
    await connect();

    const url = new URL(request.url);
    const jobId = url.searchParams.get('id');  

    let jobs;

    // Fetch single job by ID or all jobs if no ID is provided
    if (jobId) {
      // Validate jobId is a valid ObjectId
      if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid job ID' }, { status: 400 });
      }

      jobs = await Job.findById(jobId);
      
      if (!jobs) {
        return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
      }
    } else {
      jobs = await Job.find({});
      
      if (!jobs.length) {
        return NextResponse.json({ success: true, message: 'No jobs found' }, { status: 200 });
      }
    }

    return NextResponse.json({ success: true, data: jobs }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
