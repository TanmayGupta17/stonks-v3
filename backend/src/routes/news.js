const express = require('express');
const router = express.Router();
const News = require('../models/News');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get news items
router.get('/', async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const news = await News.find({})
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// Submit prediction
router.post('/predict', auth, async (req, res) => {
  try {
    const { newsId, isBullish } = req.body;
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: 'News item not found' });
    }

    const user = await User.findById(req.user.userId);
    const isCorrect = news.isBullish === isBullish;

    // Update user stats
    if (isCorrect) {
      user.experience += 50; // Award experience points for correct prediction
    }

    // Check for level up
    if (user.experience >= user.nextLevel) {
      user.level += 1;
      user.nextLevel = user.nextLevel * 1.5;
    }

    await user.save();

    res.json({
      isCorrect,
      explanation: news.explanation,
      user: {
        level: user.level,
        experience: user.experience,
        nextLevel: user.nextLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting prediction', error: error.message });
  }
});

module.exports = router;
