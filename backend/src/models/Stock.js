const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true,
    unique: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'volatile', 'stable'],
    required: true
  },
  volatility: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  description: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock; 