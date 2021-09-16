const mongoose = require('mongoose');

const ChallengeTeamSchema = new mongoose.Schema({
  url: { type: String, required: true },
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

module.exports = mongoose.model('ChallengeTeam', ChallengeTeamSchema);