const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");
const Exercise = require("./models/exercise");
const Log = require("./models/log");

const { createExercise } = require("./utils/exerciseUtils");
const { getLogs, createLog, addLog } = require("./utils/logUtils");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  try {
    const newUser = await User.create({ username });

    return res.status(201).send({ username, _id: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;

  try {
    const exerciseDoc = await createExercise(_id, req.body);
    let logDoc = await Log.findById(_id);

    if (logDoc) {
      logDoc = await addLog(_id, req.body);
    } else {
      logDoc = await createLog(_id, req.body);
    }

    return res.status(201).send({
      _id,
      username: exerciseDoc.username,
      date: exerciseDoc.date,
      duration: exerciseDoc.duration,
      description: exerciseDoc.description,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

const isDateInRange = (d, start, end) => {
  const date = new Date(d);
  const from = new Date(start);
  const to = new Date(end);

  return from <= date && date <= to;
};

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  const maxEntries = limit ? parseInt(limit, 10) : null;

  try {
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

    return res.json({
      _id: logDocs._id,
      username: logDocs.username,
      count: logs.length,
      log: logs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
