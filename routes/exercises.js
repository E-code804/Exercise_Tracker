const express = require("express");
const router = express.Router({ mergeParams: true });
const { postExercise } = require("../controllers/exerciseController");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/", asyncHandler(postExercise));

module.exports = router;
