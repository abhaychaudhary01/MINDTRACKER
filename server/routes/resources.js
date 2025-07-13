const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// Get all resources (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, type, difficulty, search } = req.query;
    
    const query = { approved: true };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(query)
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { category } = req.params;
    
    const resources = await Resource.find({ 
      category, 
      approved: true 
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments({ category, approved: true });

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured resources
router.get('/featured/list', async (req, res) => {
  try {
    const resources = await Resource.find({ 
      featured: true, 
      approved: true 
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10);

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resources for specific mental health condition
router.get('/condition/:condition', async (req, res) => {
  try {
    const { condition } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const resources = await Resource.find({
      category: condition,
      approved: true
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments({ 
      category: condition, 
      approved: true 
    });

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate a resource
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update rating
    const newRating = (resource.rating * resource.reviewCount + rating) / (resource.reviewCount + 1);
    resource.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal place
    resource.reviewCount += 1;

    await resource.save();

    res.json({
      message: 'Rating submitted successfully',
      newRating: resource.rating,
      reviewCount: resource.reviewCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Resource.distinct('category', { approved: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource types
router.get('/types/list', async (req, res) => {
  try {
    const types = await Resource.distinct('type', { approved: true });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search resources
router.get('/search/query', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const resources = await Resource.find({
      $and: [
        { approved: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { author: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments({
      $and: [
        { approved: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { author: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    });

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 