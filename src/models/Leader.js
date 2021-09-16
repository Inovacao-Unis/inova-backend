const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Leader", LeaderSchema);
