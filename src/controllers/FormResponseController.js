const { findById } = require("../models/Form");
const Form = require("../models/Form");
const FormItem = require("../models/FormItem");
const ItemChoice = require("../models/ItemChoice");
const FormResponse = require("../models/FormResponse");
const Challenge = require("../models/Challenge");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const response = await FormResponse.findById(id);

    return res.json(response);
  },

  async list(req, res) {
    const responses = await FormResponse.find();

    return res.json(responses);
  },

  async create(req, res) {
    const { items, form_id, challenge_id } = req.body;

    if (!items || items.length < 1) {
      return res.status(400).send({ error: "Nenhuma resposta foi enviada." });
    }

    if (!form_id) {
      return res
        .status(400)
        .send({ error: "Informe o formulário para continuar." });
    }

    const challenge = Challenge.findById(challenge_id);

    if (!challenge) {
      return res.status(400).send({ error: "O desafio não existe." });
    }

    // const user = await User.findOne({ uid: req.authId })

    // if (!user || !user.team_id) {
    //   return res.status(400).send({ error: 'Houve um erro com o time.' });
    // }

    // const team_id = user.team_id;

    const exists = await FormResponse.findOne({
      $and: [{ form_id }, { team_id }],
    });

    if (exists) {
      return res.status(400).send({ error: "Já respondido pelo time." });
    }

    const response = await FormResponse.create({
      items,
      form_id,
      team_id,
      challenge_id
    });

    return res.json(response);
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await FormResponse.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;

    await FormResponse.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
