const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    challenge_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    }
  }
);

module.exports = mongoose.model("Content", ContentSchema);
