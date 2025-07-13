const express = require('express');
const jwt = require('jsonwebtoken');
const Mood = require('../models/Mood');
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

// Create new mood entry
router.post('/', auth, async (req, res) => {
  try {
    const moodData = {
      ...req.body,
      userId: req.userId
    };

    const mood = new Mood(moodData);
    await mood.save();

    res.status(201).json({
      message: 'Mood entry created successfully',
      mood
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all mood entries for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Mood.countDocuments(query);

    res.json({
      moods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood entry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json(mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mood entry
router.put('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json({
      message: 'Mood entry updated successfully',
      mood
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mood entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood statistics
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

    const stats = await Mood.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageMood: { $avg: '$moodLevel' },
          averageStress: { $avg: '$stressLevel' },
          averageEnergy: { $avg: '$energyLevel' },
          totalEntries: { $sum: 1 },
          moodTypes: { $addToSet: '$moodType' }
        }
      }
    ]);

    const moodTypeStats = await Mood.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$moodType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: stats[0] || {
        averageMood: 0,
        averageStress: 0,
        averageEnergy: 0,
        totalEntries: 0,
        moodTypes: []
      },
      moodTypeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood trends (weekly/monthly)
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

    const trends = await Mood.aggregate([
      { $match: query },
      {
        $group: {
          _id: groupBy,
          averageMood: { $avg: '$moodLevel' },
          averageStress: { $avg: '$stressLevel' },
          averageEnergy: { $avg: '$energyLevel' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 