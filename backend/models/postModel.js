const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
  },
  mediaUrl: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  commentCount: {
    type: Number,
    default: 0,
  },
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  shareCount: {
    type: Number,
    default: 0,
  },
  publicId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
