const Content = require("../models/Content");
const Challenge = require("../models/Challenge");

module.exports = {
  async view(req, res) {
    const { challenge_id } = req.params;
    const content = await Content.findOne({challenge_id});

    return res.json(content);
  },

  async create(req, res) {
    const { content, challenge_id } = req.body;

    const challenge = Challenge.findById(challenge_id);

    if (!challenge) {
      return res.status(400).send({ error: "O desafio não existe." });
    }

    await Content.create({
      content,
      challenge_id
    });
    return res.json({ message: "Conteúdo criado!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Content.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Content.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
