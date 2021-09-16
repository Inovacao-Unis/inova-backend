const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "FormItem" }]
})

module.exports = mongoose.model('Form', FormSchema);