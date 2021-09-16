const Form = require('../models/Form');
const FormItem = require('../models/FormItem');
const ItemChoice = require('../models/ItemChoice');
const ItemResponse = require('../models/ItemResponse');

module.exports = {
  async view(req, res) {
    const { id } = req.params
    const formItem = await FormItem.findById(id)

    return res.json(formItem)
  },

  async list(req, res) {
    const formItems = await FormItem.find()

    return res.json(formItems)
  },

  async create(req, res) {
    const { title, type, form_id } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Informe o título para continuar.' });
    }

    if (!type) {
      return res.status(400).send({ error: 'Informe o tipo para continuar.' });
    }

    if (!form_id) {
      return res.status(400).send({ error: 'Informe o formulário para continuar.' });
    }

    const form = await Form.findById(form_id)

    if (!form) {
      return res.status(400).send({ error: 'Formulário não encontrado.' });
    }

    const item = await FormItem.create({
      title,
      type,
      form_id
    })

    form.items.push(item);
    await form.save();

    return res.json(item);
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await FormItem.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;

    const item = await FormItem.findById(id);

    if (!item) {
      return res.status(400).send({ error: 'Item não encontrado.' });
    }

    const form = await Form.findById(item.form_id);

    form.items.pull({ _id: id });
    await form.save();

    await FormItem.findByIdAndDelete({ _id: id });

    return res.json({ message: 'Deletado' });
  },
}