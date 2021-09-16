const Challenge = require("../models/Challenge");
const Journey = require("../models/Journey");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const journey = await Challenge.findById(id);

    return res.json(journey);
  },

  async list(req, res) {
    const challenges = await Challenge.find();
    return res.json({ challenges });
  },

  async create(req, res) {
    const { title, position = 1, journey_id } = req.body;

    if (!title) {
      return res.status(400).send({ error: "Informe o título para continuar." });
    }

    const slug = normalize(title);

    const journey = Journey.findById(journey_id)

    if (!journey) {
      return res.status(400).send({ error: "Jornada não existe." });
    }

    const exists = await Challenge.findOne({ slug });

    if (exists) {
      return res.status(400).send({ error: "Desafio já existe" });
    }

    await Challenge.create({
      title,
      slug,
      position,
      journey_id
    });
    return res.json({ message: "Desafio criado!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Challenge.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Challenge.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
