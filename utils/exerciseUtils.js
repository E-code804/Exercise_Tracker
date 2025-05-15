const Exercise = require("../models/exercise");
const User = require("../models/user");
const Log = require("../models/log");

const { createLog, addLog } = require("../utils/logUtils");

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

const addExercise = async ({ userId, description, duration, date }) => {
  const exerciseDoc = await createExercise(userId, { description, duration, date });
  // If user has existing logs, add to it, otherwise create a new Log
  (await Log.findById(userId))
    ? await addLog(userId, { description, duration, date })
    : await createLog(userId, { description, duration, date });

  return exerciseDoc;
};

module.exports = { createExercise, addExercise };
