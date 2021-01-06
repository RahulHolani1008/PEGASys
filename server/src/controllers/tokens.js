const Token = require("../models/tokens");

exports.addToken = async (req, res, next) => {
  const token = req.body;
  const newToken = new Token(token);
  await newToken
    .save()
    .then((item) => res.send(item))
    .catch((err) => res.status(400).send(err));
};

exports.invalidateTokensByUserId = async (req, res, next) => {
     await Token.find({user: req.body.id})
    .then((item) => {console.log(item); return res.send(item)})
    .catch((err) => res.status(400).send(err));
};

exports.invalidateTokensAllTokens = async (req, res, next) => {
    await Token.find()
   .then((item) => {console.log(item); return res.send(item)})
   .catch((err) => res.status(400).send(err));
};
