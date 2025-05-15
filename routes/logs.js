const express = require("express");
const router = express.Router({ mergeParams: true });
const { getLogData } = require("../controllers/logController");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", asyncHandler(getLogData));

module.exports = router;
