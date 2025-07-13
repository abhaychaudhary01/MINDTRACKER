const express = require('express');
const Professional = require('../models/Professional');
const router = express.Router();

// Get all professionals (public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      profession, 
      specialization, 
      availability, 
      cost,
      emergency,
      search 
    } = req.query;
    
    const query = { verified: true };
    
    if (profession) {
      query.profession = profession;
    }
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (availability) {
      query.availability = availability;
    }
    
    if (cost) {
      query.cost = cost;
    }
    
    if (emergency === 'true') {
      query.emergency = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } }
      ];
    }

    const professionals = await Professional.find(query)
      .sort({ emergency: -1, rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments(query);

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professionals by profession
router.get('/profession/:profession', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { profession } = req.params;
    
    const professionals = await Professional.find({ 
      profession, 
      verified: true 
    })
      .sort({ rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments({ profession, verified: true });

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professionals by specialization
router.get('/specialization/:specialization', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { specialization } = req.params;
    
    const professionals = await Professional.find({ 
      specialization, 
      verified: true 
    })
      .sort({ rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments({ specialization, verified: true });

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get emergency professionals
router.get('/emergency/list', async (req, res) => {
  try {
    const professionals = await Professional.find({ 
      emergency: true, 
      verified: true 
    })
      .sort({ rating: -1, experience: -1 })
      .limit(20);

    res.json(professionals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search professionals by location
router.get('/location/search', async (req, res) => {
  try {
    const { city, state, page = 1, limit = 10 } = req.query;
    
    if (!city && !state) {
      return res.status(400).json({ error: 'City or state is required' });
    }

    const query = { verified: true };
    
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    const professionals = await Professional.find(query)
      .sort({ rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments(query);

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate a professional
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const professional = await Professional.findById(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    // Update rating
    const newRating = (professional.rating * professional.reviewCount + rating) / (professional.reviewCount + 1);
    professional.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal place
    professional.reviewCount += 1;

    await professional.save();

    res.json({
      message: 'Rating submitted successfully',
      newRating: professional.rating,
      reviewCount: professional.reviewCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional professions
router.get('/professions/list', async (req, res) => {
  try {
    const professions = await Professional.distinct('profession', { verified: true });
    res.json(professions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional specializations
router.get('/specializations/list', async (req, res) => {
  try {
    const specializations = await Professional.distinct('specialization', { verified: true });
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professionals by cost
router.get('/cost/:cost', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { cost } = req.params;
    
    const professionals = await Professional.find({ 
      cost, 
      verified: true 
    })
      .sort({ rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments({ cost, verified: true });

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professionals with sliding scale
router.get('/sliding-scale/list', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const professionals = await Professional.find({ 
      slidingScale: true, 
      verified: true 
    })
      .sort({ rating: -1, experience: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Professional.countDocuments({ slidingScale: true, verified: true });

    res.json({
      professionals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 