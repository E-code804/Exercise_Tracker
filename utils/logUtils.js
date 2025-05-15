const Log = require("../models/log");
const User = require("../models/user");

const getLogs = async (_id) => {
  const userDoc = await User.findById(_id);

  if (!userDoc) return null;

  const logs = await Log.findById(_id);
  return logs;
};

const getLogData = async (_id, from, to, limit) => {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  const maxEntries = limit ? parseInt(limit, 10) : null;

  const logDocs = await getLogs(_id);
  let logs = logDocs.log;

  if (fromDate || toDate) {
    logs = logs.filter(
      (log) =>
        (!fromDate || new Date(log.date) >= fromDate) &&
        (!toDate || new Date(log.date) <= toDate)
    );
  }
  if (maxEntries) {
    logs = logs.slice(0, maxEntries);
  }

  return { logDocs, logs };
};

const createLog = async (_id, { description, duration, date }) => {
  const userDoc = await User.findById(_id);

  if (!userDoc) return null;

  const dateStr = date ? new Date(date).toDateString() : new Date().toDateString();
  console.log(dateStr);

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

  console.log(newLog);

  return newLog;
};

const addLog = async (_id, { description, duration, date }) => {
  const userDoc = await User.findById(_id);

  if (!userDoc) return null;

  const dateStr = date ? new Date(date).toDateString() : new Date().toDateString();
  console.log(dateStr);

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
  console.log(updatedLog);

  if (!updatedLog) return null;
  return updatedLog;
};

module.exports = { getLogs, createLog, addLog, getLogData };
