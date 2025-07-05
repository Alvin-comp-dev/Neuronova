import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Research', 'Engineering', 'Data Science', 'Healthcare', 'Neuroscience', 'Biotech']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'At least one requirement is required'
    }
  },
  responsibilities: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'At least one responsibility is required'
    }
  },
  qualifications: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'At least one qualification is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
jobSchema.index({ department: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });

// Add text search index for job search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  department: 'text',
  location: 'text'
}, {
  weights: {
    title: 10,
    department: 5,
    location: 5,
    description: 1
  }
});

// Clean up the data before saving
jobSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job; 