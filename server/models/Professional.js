const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  profession: {
    type: String,
    enum: ['psychiatrist', 'psychologist', 'therapist', 'counselor', 'social-worker', 'life-coach', 'nutritionist', 'fitness-trainer'],
    required: true
  },
  specialization: [{
    type: String,
    enum: ['anxiety', 'depression', 'trauma', 'addiction', 'relationships', 'grief', 'stress', 'eating-disorders', 'sleep', 'adhd', 'autism', 'general']
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  availability: {
    type: String,
    enum: ['in-person', 'virtual', 'both'],
    default: 'both'
  },
  languages: [String],
  insurance: [String],
  slidingScale: {
    type: Boolean,
    default: false
  },
  cost: {
    type: String,
    enum: ['free', 'low-cost', 'moderate', 'high', 'varies']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  emergency: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: 1000
  },
  credentials: [String],
  experience: {
    type: Number,
    description: 'Years of experience'
  }
}, {
  timestamps: true
});

// Index for efficient queries
professionalSchema.index({ profession: 1, specialization: 1, location: 1 });

module.exports = mongoose.model('Professional', professionalSchema); 