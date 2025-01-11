import { connect } from '@/dbConnection/dbConnection';
import Job from '@/models/jobspostingModel';
import { NextResponse } from 'next/server';

connect();

// DELETE: Delete job
export async function DELETE(request, { params }) {
  try {
    const jobId = params.id; // Extract Job ID from parameters
    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is missing' }, { status: 400 });
    }

    // Step 1: Fetch job details from MongoDB
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    // Step 2: Delete the job from MongoDB
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return NextResponse.json({ success: false, message: 'Failed to delete job from MongoDB' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Job successfully deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


// PUT: Update job details
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Job ID is missing' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid JSON input' }, { status: 400 });
    }

    const { title, location, salaryRange, type, description, requirements, responsibilities } = body;

    if (!title || !location || !type || !salaryRange || !salaryRange.min || !salaryRange.max) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        location,
        salaryRange,
        type,
        description,
        requirements: requirements || [],
        responsibilities: responsibilities || [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedJob }, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

