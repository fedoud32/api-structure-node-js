const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  campagne: {
    type: String,
  },
  country: {
    type: String,
  },
  test: {
    type: Boolean,
  },
  optimize: {
    type: Boolean,
  },
  currency: {
    type: String,
  },
  placement: {
    type: String,
  },
  budgetType: {
    type: String,
  },
  cout: {
    type: String,
  },
  budgetTime: {
    type: String,
  },
  typeDate: {
    type: String,
  },
  ageMin: {
    type: Number,
  },
  ageMax: {
    type: Number,
  },
  lieux: {
    type: String,
  },
  Genre: {
    type: String,
  },
  checked: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Form", PostSchema);
