const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Point', PointSchema);