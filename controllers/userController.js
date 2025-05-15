const User = require("../models/user");

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).send(users);
};

const postUser = async (req, res) => {
  const { username, _id } = await User.create({ username: req.body.username });
  return res.status(201).send({ username, _id });
};

module.exports = { getUsers, postUser };
