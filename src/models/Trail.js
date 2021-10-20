const mongoose = require("mongoose");

const TrailSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    schedule: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leader',
      required: true
    },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }]
  }
);

module.exports = mongoose.model("Trail", TrailSchema);
