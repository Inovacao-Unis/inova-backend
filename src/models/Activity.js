const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leader',
      required: true
    },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }]
  }
);

module.exports = mongoose.model("Activity", ActivitySchema);
