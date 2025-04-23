const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks', error: error.message });
  }
});

// Buy stock
router.post('/buy', auth, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const stock = await Stock.findById(stockId);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const user = await User.findById(req.user.userId);
    const totalCost = stock.basePrice * quantity;

    // Add to user's portfolio
    user.portfolio.push({
      stockId: stock._id,
      name: stock.name,
      ticker: stock.ticker,
      currentPrice: stock.basePrice,
      quantity,
      purchasePrice: stock.basePrice,
      purchaseDate: new Date()
    });

    await user.save();
    res.json({ message: 'Stock purchased successfully', portfolio: user.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing stock', error: error.message });
  }
});

// Sell stock
router.post('/sell', auth, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    
    const stockIndex = user.portfolio.findIndex(item => item.stockId.toString() === stockId);
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in portfolio' });
    }

    if (user.portfolio[stockIndex].quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity to sell' });
    }

    user.portfolio[stockIndex].quantity -= quantity;
    if (user.portfolio[stockIndex].quantity === 0) {
      user.portfolio.splice(stockIndex, 1);
    }

    await user.save();
    res.json({ message: 'Stock sold successfully', portfolio: user.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Error selling stock', error: error.message });
  }
});

module.exports = router; 