const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    description: '1 = Very Sad, 10 = Very Happy'
  },
  moodType: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'stressed', 'peaceful', 'other'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  activities: [{
    type: String,
    enum: ['exercise', 'meditation', 'social', 'work', 'sleep', 'eating', 'hobby', 'other']
  }],
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema); 