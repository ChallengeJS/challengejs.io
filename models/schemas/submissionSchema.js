const mongoose = require('mongoose');

module.exports =  new mongoose.Schema({
  owner_id: String,
  run_attempts: Number,
  code: String,
  success: {type: Boolean, default: false}
}, {
  timestamps : true
});
