const Form = require('../models/Form');
const FormItem = require('../models/FormItem');
const ItemChoice = require('../models/ItemChoice');
const ItemResponse = require('../models/ItemResponse');

module.exports = {
  async view(req, res) {
    const { id } = req.params
    const choice = await ItemChoice.findById(id)

    return res.json(choice)
  },

  async list(req, res) {
    const choices = await ItemChoice.find()

    return res.json(choices)
  },

  async create(req, res) {
    const { title, isCorrect = false, item_id, form_id } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Informe o título para continuar.' });
    }

    if (!item_id) {
      return res.status(400).send({ error: 'Informe o item para continuar.' });
    }

    if (!form_id) {
      return res.status(400).send({ error: 'Informe o formulário para continuar.' });
    }

    const item = await FormItem.findById(item_id)

    if (!item) {
      return res.status(400).send({ error: 'Item não encontrado.' });
    }

    if (item.type !== "multi") {
      return res.status(400).send({ error: 'O tipo do item precisa ser multi para ter opções de resposta.' });
    }

    const choice = await ItemChoice.create({
      title,
      isCorrect,
      item_id,
      form_id
    })

    item.choices.push(choice);
    await item.save();

    return res.json(choice);
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await ItemChoice.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    
    await ItemChoice.findByIdAndDelete({ _id: id });

    return res.json({ message: 'Deletado' });
  },
}