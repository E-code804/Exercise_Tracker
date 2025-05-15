const express = require("express");
const router = express.Router({ mergeParams: true });
const { getLogs } = require("../controllers/logController");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", asyncHandler(getLogs));

module.exports = router;
