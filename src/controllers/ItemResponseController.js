const { findById } = require('../models/Form');
const Form = require('../models/Form');
const FormItem = require('../models/FormItem');
const ItemChoice = require('../models/ItemChoice');
const ItemResponse = require('../models/ItemResponse');
const User = require('../models/User');

module.exports = {
  async view(req, res) {
    const { id } = req.params
    const response = await ItemResponse.findById(id)

    return res.json(response)
  },

  async list(req, res) {
    const responses = await ItemResponse.find()

    return res.json(responses)
  },

  async create(req, res) {
    const { title, item_id, form_id } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Informe a resposta para continuar.' });
    }

    if (!item_id) {
      return res.status(400).send({ error: 'Informe o item para continuar.' });
    }

    if (!form_id) {
      return res.status(400).send({ error: 'Informe o formulário para continuar.' });
    }

    const user = await User.findOne({ uid: req.authId })

    if (!user || !user.team_id) {
      return res.status(400).send({ error: 'Houve um erro com o time.' });
    }

    const team_id = user.team_id;

    const isExists = await ItemResponse.findOne({
      $and: [
        { form_id },
        { team_id }
      ]
    })

    if (!isExists) {
      return res.status(400).send({ error: 'Já respondido pelo time.' });
    }

    const response = await ItemResponse.create({
      title,
      item_id,
      form_id,
      team_id
    })

    return res.json(response);
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await ItemResponse.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    
    await ItemResponse.findByIdAndDelete({ _id: id });

    return res.json({ message: 'Deletado' });
  },
}