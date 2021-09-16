const mongoose = require('mongoose');

const ItemResponseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormItem',
    required: true
  },
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
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

module.exports = mongoose.model('ItemResponse', ItemResponseSchema);