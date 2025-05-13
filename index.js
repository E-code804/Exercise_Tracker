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
const { createLog, addLog } = require("./utils/logUtils");

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

    return res.status(200).send({ users });
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
  const { _id, description, duration, date } = req.body;
  console.log(_id, description, duration, date);

  try {
    const exerciseDoc = await createExercise(req.body);
    let logDoc = await Log.findById(_id);
    console.log(logDoc);

    if (logDoc) {
      logDoc = await addLog(req.body);
    } else {
      logDoc = await createLog(req.body);
    }

    return res.status(201).send({
      _id,
      username: exerciseDoc.username,
      date: exerciseDoc.date,
      duration,
      description,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
