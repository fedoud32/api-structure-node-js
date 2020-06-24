const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  message: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  fullName: {
    type: String,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);