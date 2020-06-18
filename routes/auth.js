const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// validation
const {
  registerValidation,
  loginValidation,
} = require("../validations/userValidation");

router.post("/register", async (req, res) => {
  const error = registerValidation(req.body);
  if (error.error) return res.status(400).send(error.error.details);

  // checking if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send({ message: "email existe deja" });
  }

  // haching the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // creating a user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    // console.log(savedUser);
    res.send({
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      status: 200,
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
    res.status(400).send({ message: "email ou mot de passe incorrect" });
  }
  //password check
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({ message: "email ou mot de passe incorrect" });
  // create and assign jwt
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 86400,
  });
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESHTOKEN_SECRET,
    {
      expiresIn: 604800,
    }
  );
  const transformedUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    refreshToken: refreshToken,
  };
  await User.updateOne({ _id: user._id }, { $set: transformedUser });
  // console.log(transformedUser)
  res.header("Authorisation", token).send({
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      },
      token: {
        token: token,
        refreshToken: refreshToken,
      },
    },
    status: 200,
  });
});

router.post("/refresh", async (req, res) => {
  try {
    const oldRefreshToken = req.body.refreshToken;
    const verify = jwt.verify(oldRefreshToken, process.env.REFRESHTOKEN_SECRET);
    if (!verify) return res.status(401).send({ message: "INVALID TOKEN." });

    const decoded = jwt.decode(oldRefreshToken);
    const user = await User.findOne({ _id: decoded._id });

    if (user.refreshToken === oldRefreshToken) {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 86400,
      });
      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESHTOKEN_SECRET,
        {
          expiresIn: 604800,
        }
      );

      await User.updateOne({ _id: user._id }, { refreshToken });
      res.status(200).send({
        data: {
          token,
          refreshToken,
        },
        status: 200,
      });
    } else {
      console.log(user.refreshToken === oldRefreshToken)
      res.status(400).send("error refreshtoken");
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send({ message: "Access denied " + err.message });
  }
});

module.exports = router;
