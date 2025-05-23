const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true
  },
  scores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score'
  }]
});

module.exports = mongoose.model('Team', teamSchema);