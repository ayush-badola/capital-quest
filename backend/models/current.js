const mongoose = require('mongoose');

const currentSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
});

// We’ll keep a *single* document in this collection whose `.team` is the current one.
module.exports = mongoose.model('Current', currentSchema);
