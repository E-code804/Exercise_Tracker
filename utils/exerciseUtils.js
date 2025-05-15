const Exercise = require("../models/exercise");
const User = require("../models/user");

const createExercise = async (_id, { description, duration, date }) => {
  let userDoc = await User.findById(_id);

  if (!userDoc) return null;

  let dateStr = date ? new Date(date).toDateString() : new Date().toDateString();

  const newExercise = await Exercise.create({
    username: userDoc.username,
    description,
    duration,
    date: dateStr,
  });

  return newExercise;
};

module.exports = { createExercise };
