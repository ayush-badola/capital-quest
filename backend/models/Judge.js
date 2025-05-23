const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxPoints: { type: Number, default: 100 },
  assignedPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('Judge', judgeSchema);