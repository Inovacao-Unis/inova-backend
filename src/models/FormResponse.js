const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema({
  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormItem',
        required: true
      },
      response: { type: String, required: true }
    }
  ],
  
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
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

module.exports = mongoose.model('FormResponse', FormResponseSchema);