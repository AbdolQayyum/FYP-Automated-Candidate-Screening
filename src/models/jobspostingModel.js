import mongoose from 'mongoose';

// Define the job schema
const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  location: { 
    type: String, 
    required: true, 
    trim: true 
  },
  salaryRange: { 
    min: { 
      type: Number, 
      required: true 
    }, 
    max: { 
      type: Number, 
      required: true 
    }
  },
  postedAt: { 
    type: Date, 
    default: Date.now 
  },
  type: { 
    type: String, 
    enum: ['Full Time', 'Part Time','Remote','Contract', 'Freelance', 'Internship'], 
    default: 'Full Time' 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  requirements: { 
    type: [String], 
    default: [] 
  },
  responsibilities: { 
    type: [String], 
    default: [] 
  },
  
});

// Follow the same export pattern
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;
