const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  slug: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  body: {
    type: String,
    required: false,
  },
  approved: {
    type: Boolean,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

module.exports = mongoose.model("Posts", PostSchema);
