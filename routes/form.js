const express = require("express");
const router = express.Router();
const Form = require("../models/form");
const verify = require("./checkToken");
const jwtDecode = require("jwt-decode");
const User = require("../models/user");


// get one post by id
router.get("/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    res.json({
      data: {
        savedForm: form,
      },
      status: 200,
    });
  } catch (err) {
    res.json(err);
  }
});

// create post
router.post("/", verify, async (req, res) => {
  const token = req.header("Authorization");
  const activeToken = token.substring(7);
  const decode = jwtDecode(activeToken);
  const user = await User.findById(decode._id).select("firstName lastName");
  /* console.log(user); */
  try {
  const form = new Form({
    user: user,
    campagne: req.body.campagne,
    country: req.body.country,
    test: req.body.test,
    optimize: req.body.optimize,
    zone: req.body.zone,
    currency: req.body.currency,
    placement: req.body.placement,
    budgetType: req.body.budgetType,
    cout: req.body.cout,
    budgetTime: req.body.budgetTime,
    money: req.body.money,
    typeDate: req.body.typeDate,
    ageMin: req.body.ageMin,
    ageMax: req.body.ageMax,
    lieux: req.body.lieux,
    Genre: req.body.Genre,
    checked: req.body.checked,
  });
 
    const savedForm = await form.save();
    /* console.log(savedForm) */
    res.json({
      data: {
        savedForm,
      },
      status: 200,
    });
  } catch (err) {
    res.send({ message: err });
  }
});

module.exports = router;
