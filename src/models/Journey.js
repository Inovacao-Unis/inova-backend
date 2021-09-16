const mongoose = require("mongoose");

const JourneySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String },
    challenges: [{type: mongoose.Schema.Types.ObjectId, ref: "Challenge"}]
  }
);

module.exports = mongoose.model("Journey", JourneySchema);
