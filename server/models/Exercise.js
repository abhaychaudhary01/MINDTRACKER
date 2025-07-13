const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exerciseType: {
    type: String,
    enum: ['cardio', 'strength', 'yoga', 'pilates', 'walking', 'running', 'cycling', 'swimming', 'dancing', 'meditation', 'stretching', 'other'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    description: 'Duration in minutes'
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  moodBefore: {
    type: Number,
    min: 1,
    max: 10
  },
  moodAfter: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    enum: ['home', 'gym', 'outdoor', 'studio', 'other']
  },
  equipment: [String],
  heartRate: {
    average: Number,
    max: Number
  },
  distance: {
    type: Number,
    description: 'Distance in kilometers'
  },
  steps: {
    type: Number,
    description: 'Number of steps'
  }
}, {
  timestamps: true
});

// Index for efficient queries
exerciseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Exercise', exerciseSchema); 