const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toDateString(),
    set: (v) => new Date(v).toDateString(),
  },
});

const logSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    log: {
      type: [logEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", logSchema);
