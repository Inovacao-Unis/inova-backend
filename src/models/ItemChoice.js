const mongoose = require('mongoose');

const ItemChoiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormItem',
    required: true
  },
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  }
})

module.exports = mongoose.model('ItemChoice', ItemChoiceSchema);