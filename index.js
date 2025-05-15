const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("express-async-errors");
require("dotenv").config();

const exercisesRouter = require("./routes/exercises");
const logsRouter = require("./routes/logs");

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
  const users = await User.find({});
  return res.status(200).send(users);
});

app.post("/api/users", async (req, res) => {
  const { _id, username } = await User.create({ username: req.body.username });
  return res.status(201).send({ username, _id });
});

// app.post("/api/users/:_id/exercises", async (req, res) => {
//   const { _id: userId } = req.params;

//   const exerciseDoc = await createExercise(userId, req.body);
//   (await Log.findById(userId))
//     ? await addLog(userId, req.body)
//     : await createLog(userId, req.body);

//   return res.status(201).send({
//     _id: userId,
//     username: exerciseDoc.username,
//     date: exerciseDoc.date,
//     duration: exerciseDoc.duration,
//     description: exerciseDoc.description,
//   });
// });

app.use("/api/users/:_id/exercises", exercisesRouter);

// app.get("/api/users/:_id/logs", async (req, res) => {
//   const { _id } = req.params;
//   const { from, to, limit } = req.query;

//   const fromDate = from ? new Date(from) : null;
//   const toDate = to ? new Date(to) : null;
//   const maxEntries = limit ? parseInt(limit, 10) : null;

//   const logDocs = await getLogs(_id);
//   let logs = logDocs.log;

//   if (fromDate || toDate) {
//     logs = logs.filter(
//       (log) =>
//         (!fromDate || new Date(log.date) >= fromDate) &&
//         (!toDate || new Date(log.date) <= toDate)
//     );
//   }
//   if (maxEntries) {
//     logs = logs.slice(0, maxEntries);
//   }

//   return res.json({
//     _id: logDocs._id,
//     username: logDocs.username,
//     count: logs.length,
//     log: logs,
//   });
// });

app.use("/api/users/:_id/logs", logsRouter);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.sendStatus(500);
// });
