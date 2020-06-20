const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/", async (req, res) => {
  try {
    const contact = new Contact({
      email: req.body.email,
      fullName: req.body.fullName,
      subject: req.body.subject,
      message: req.body.message,
    });
    const savedContact = await contact.save();
    res.status(200).send({
      data: {
        savedContact,
      },
      status: 200,
    });
  } catch (err) {
    res.status(400).send({ data: { message: err }, status: 400 });
  }
});

module.exports = router;