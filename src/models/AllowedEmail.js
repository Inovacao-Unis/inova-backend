const mongoose = require("mongoose");

const AllowedEmailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AllowedEmail", AllowedEmailSchema);
