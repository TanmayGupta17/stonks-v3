const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get quiz questions
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Quiz.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// Submit quiz answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const user = await User.findById(req.user.userId);
    
    let correctCount = 0;
    let totalExperience = 0;

    for (const answer of answers) {
      const question = await Quiz.findById(answer.questionId);
      if (!question) continue;

      if (answer.selectedOption === question.correctAnswer) {
        correctCount++;
        totalExperience = totalExperience +  question.experiencePoints*100;
      }
    }

    // Update user stats
    user.totalQuizzes += 1;
    user.correctAnswers += correctCount;
    user.incorrectAnswers += (answers.length - correctCount);
    user.experience += totalExperience;

    // Check for level up
    if (user.experience >= user.nextLevel) {
      user.level += 1;
      user.nextLevel = user.nextLevel * 1.5; // Increase next level requirement
    }

    // Update streak
    const today = new Date();
    const lastQuizDate = user.lastQuizDate || new Date(0);
    const dayDiff = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      user.streak += 1;
    } else if (dayDiff > 1) {
      user.streak = 1;
    }
    
    user.lastQuizDate = today;

    await user.save();

    res.json({
      correctCount,
      totalQuestions: answers.length,
      experienceGained: totalExperience,
      user: {
        level: user.level,
        experience: user.experience,
        nextLevel: user.nextLevel,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
});

module.exports = router; 