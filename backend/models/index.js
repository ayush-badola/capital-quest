const mongoose = require('mongoose');
require('./Team');
require('./Judge');
require('./Score');

// Optional: Add any model relationships here
module.exports = {
  Team: mongoose.model('Team'),
  Judge: mongoose.model('Judge'),
  Score: mongoose.model('Score')
};