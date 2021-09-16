const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String },
    users: [String]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", TeamSchema);
