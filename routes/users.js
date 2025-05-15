const express = require("express");
const router = express.Router({ mergeParams: true });
const { getUsers, postUser } = require("../controllers/userController");
const asyncHandler = require("../middleware/asyncHandler");

const exercisesRouter = require("./exercises");
const logsRouter = require("./logs");

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(postUser));

router.use("/:_id/exercises", exercisesRouter);
router.use("/:_id/logs", logsRouter);

module.exports = router;
