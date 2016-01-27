const mongoose = require('mongoose'),
  submissionSchema = require('./schemas/submissionSchema');

module.exports = mongoose.model('Submission', submissionSchema);
