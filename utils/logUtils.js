const Log = require("../models/log");
const User = require("../models/user");

const createLog = async ({ _id, description, duration, date }) => {
  const userDoc = await User.findById(_id);

  if (!userDoc) return null;

  const dateStr = date ? new Date(date).toDateString() : new Date().toDateString();

  const newLog = await Log.create({
    username: userDoc.username,
    count: 1,
    log: [
      {
        description,
        duration,
        date: dateStr,
      },
    ],
    _id,
  });

  return newLog;
};

const addLog = async ({ _id, description, duration, date }) => {
  const userDoc = await User.findById(_id);

  if (!userDoc) return null;

  const dateStr = date ? new Date(date).toDateString() : new Date().toDateString();

  const update = {
    $push: {
      log: {
        description,
        duration,
        date: dateStr,
      },
    },
    $inc: { count: 1 },
  };

  const updatedLog = await Log.findByIdAndUpdate(_id, update, { new: true });

  if (!updatedLog) return null;
  return updatedLog;
};

module.exports = { createLog, addLog };
