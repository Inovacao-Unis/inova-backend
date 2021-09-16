const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    journey_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
