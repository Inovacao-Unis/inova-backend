const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    position: { type: Number, required: true },
    journey_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
      required: true
    }
  }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
