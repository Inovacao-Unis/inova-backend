const mongoose = require('mongoose');

const FormItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, //short, long, multi, upload
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "ItemChoice" }]
})

module.exports = mongoose.model('FormItem', FormItemSchema);