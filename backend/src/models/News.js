const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  stockTicker: {
    type: String,
    required: true
  },
  newsHeadline: {
    type: String,
    required: true
  },
  newsDetails: {
    type: String,
    required: true
  },
  isBullish: {
    type: Boolean,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
