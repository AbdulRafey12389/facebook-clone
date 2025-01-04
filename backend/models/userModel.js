const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    default: null
  },
  bio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bio"
  },
  profilePicture: {
    type: String,
    default: null,
  },
  coverPhoto: {
    type: String,
    default: null,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  followerCount: {
    type: Number,
    default: 0
  },

  followingCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
