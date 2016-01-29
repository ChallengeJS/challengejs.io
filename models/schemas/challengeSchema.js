const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: 'string',
  defaultCode: 'string',
  author: 'string',
  live: 'boolean',
  files: ['string']
}, {
  timestamps: true
});
