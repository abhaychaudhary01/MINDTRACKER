const express = require('express');
const jwt = require('jsonwebtoken');
const Exercise = require('../models/Exercise');
const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Create new exercise entry
router.post('/', auth, async (req, res) => {
  try {
    const exerciseData = {
      ...req.body,
      userId: req.userId
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.status(201).json({
      message: 'Exercise entry created successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all exercise entries for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, exerciseType } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (exerciseType) {
      query.exerciseType = exerciseType;
    }

    const exercises = await Exercise.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Exercise.countDocuments(query);

    res.json({
      exercises,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exercise entry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise entry not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exercise entry
router.put('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise entry not found' });
    }

    res.json({
      message: 'Exercise entry updated successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exercise entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise entry not found' });
    }

    res.json({ message: 'Exercise entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exercise statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Exercise.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDistance: { $sum: '$distance' },
          totalSteps: { $sum: '$steps' },
          averageMoodBefore: { $avg: '$moodBefore' },
          averageMoodAfter: { $avg: '$moodAfter' },
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    const exerciseTypeStats = await Exercise.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$exerciseType',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          averageMoodImprovement: { $avg: { $subtract: ['$moodAfter', '$moodBefore'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: stats[0] || {
        totalDuration: 0,
        totalCalories: 0,
        totalDistance: 0,
        totalSteps: 0,
        averageMoodBefore: 0,
        averageMoodAfter: 0,
        totalSessions: 0
      },
      exerciseTypeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exercise trends
router.get('/stats/trends', auth, async (req, res) => {
  try {
    const { period = 'weekly', startDate, endDate } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupBy;
    if (period === 'weekly') {
      groupBy = { $week: '$date' };
    } else if (period === 'monthly') {
      groupBy = { $month: '$date' };
    } else {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
    }

    const trends = await Exercise.aggregate([
      { $match: query },
      {
        $group: {
          _id: groupBy,
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          averageMoodImprovement: { $avg: { $subtract: ['$moodAfter', '$moodBefore'] } },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exercise recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { moodLevel, energyLevel, stressLevel } = req.query;
    
    let recommendations = [];

    // Based on mood level
    if (moodLevel <= 3) {
      recommendations.push({
        type: 'cardio',
        reason: 'Cardio exercises release endorphins that can improve mood',
        suggestions: ['Walking', 'Running', 'Cycling', 'Dancing']
      });
    }

    // Based on energy level
    if (energyLevel <= 3) {
      recommendations.push({
        type: 'low-intensity',
        reason: 'Low-intensity exercises can help build energy gradually',
        suggestions: ['Walking', 'Gentle yoga', 'Stretching', 'Tai chi']
      });
    } else if (energyLevel >= 8) {
      recommendations.push({
        type: 'high-intensity',
        reason: 'High energy levels are perfect for intense workouts',
        suggestions: ['Running', 'HIIT', 'Strength training', 'Swimming']
      });
    }

    // Based on stress level
    if (stressLevel >= 7) {
      recommendations.push({
        type: 'mind-body',
        reason: 'Mind-body exercises can help reduce stress',
        suggestions: ['Yoga', 'Meditation', 'Pilates', 'Deep breathing exercises']
      });
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 