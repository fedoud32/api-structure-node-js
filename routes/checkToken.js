const jwt = require("jsonwebtoken");


module.exports = function(req, res, next) {
  const token = req.header("Authorization")
  const activeToken = token.substring(7)
  if (!activeToken) {
    return res.status(401).send({message:"accées refusé"});
  }
  try {
    const verified = jwt.verify(activeToken, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({message:"token invalide"});
  }
};
