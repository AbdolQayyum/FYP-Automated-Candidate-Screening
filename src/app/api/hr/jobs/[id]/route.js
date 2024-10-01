import { connect } from '@/dbConnection/dbConnection';
import Job from '@/models/jobspostingModel';
import { NextResponse } from 'next/server';

// Helper function to connect to DB and find the job by ID
async function findJobById(id) {
  await connect();

  if (!id) {
    return { success: false, message: 'Job ID is required', status: 400 };
  }

  const job = await Job.findById(id);

  if (!job) {
    return { success: false, message: 'Job not found', status: 404 };
  }

  return { success: true, job };
}

// Update (PUT) job handler
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // Common function for validation and database connection
    const result = await findJobById(id);
    if (!result.success) return NextResponse.json(result, { status: result.status });

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

    // Update the job
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

    return NextResponse.json({ success: true, data: updatedJob }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Delete (DELETE) job handler
export async function DELETE(request, { params }) {
  try {
    await connect();

    const jobId = params.id; // Ensure you extract the ID correctly

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is missing' }, { status: 400 });
    }


    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
