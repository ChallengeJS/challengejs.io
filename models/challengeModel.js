const mongoose = require('mongoose'),
  challengeSchema = require('./schemas/challengeSchema');


module.exports = mongoose.model('Challenge', challengeSchema);
