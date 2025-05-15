const User = require("../models/user");

const getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

const createUser = async (username) => {
  const newUser = await User.create({ username });
  return newUser;
};

module.exports = { getAllUsers, createUser };
