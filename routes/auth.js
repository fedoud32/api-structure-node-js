const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// validation
const {
  registerValidation,
  loginValidation
} = require("../validations/userValidation");

router.post("/register", async (req, res) => {
  const error = registerValidation(req.body);
  if (error.error) return res.status(400).send(error.error.details);

  // checking if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send("email existe deja");
  }

  // haching the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // creating a user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    // console.log(savedUser);
    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/login", async (req, res) => {
  // validation
  const error = loginValidation(req.body);
  if (error.error) return res.status(400).send(error.error.details);

  // checking if email already exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("email ou mot de passe incorrect");
  }
  //password check
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send("email ou mot de passe incorrect");
  // create and assign jwt
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("token", token).send(token);
});

module.exports = router;
