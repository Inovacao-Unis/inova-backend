const mongoose = require('mongoose');

const CoinSubtractSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  message: { type: String, required: true },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('CoinSubtract', CoinSubtractSchema);