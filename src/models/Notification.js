const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    message: String,
    createdAt: { type: Date, default: Date.now },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
    
})

module.exports = mongoose.model('Notification', NotificationSchema);