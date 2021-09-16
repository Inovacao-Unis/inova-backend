const Team = require("../models/Team");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const team = await Team.findById(id);

    return res.json(team);
  },

  async list(req, res) {
    const teams = await Team.find();
    return res.json({ teams });
  },

  async create(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Informe o nome para continuar." });
    }

    const username = normalize(name);

    const exists = await Team.findOne({ username });

    if (exists) {
      return res.status(400).send({ error: "Time já existe" });
    }

    await Team.create({
      name,
      username,
    });
    return res.json({ message: "Time criado!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Team.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Team.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
