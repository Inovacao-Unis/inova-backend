const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  feedback: { type: String },
  responseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
    required: true
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leader',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Point', PointSchema);