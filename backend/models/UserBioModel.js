const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bioText: {
    type: String,
    default: null
  },
  liveIn: {
    type: String,
    default: null
  },
  relationShip: {
    type: String,
    default: null
  },
  workplace: {
    type: String,
    default: null
  },
  education: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  hometown: {
    type: String,
    default: null
  }
}, { timestamps: true } );

module.exports = mongoose.model('Bio', bioSchema);
