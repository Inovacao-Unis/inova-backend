const Category = require("../models/Category");
const Activity = require("../models/Activity");
const Leader = require("../models/Leader");
const crypto = require("crypto");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    return res.json(activity);
  },

  async list(req, res) {
    const activities = await Activity.find();
    return res.json(activities);
  },

  async create(req, res) {
    const { title, leaderId, challenges } = req.body;

    if (!title) {
      return res.status(400).send({ error: "Informe o título para continuar." });
    }

    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res.status(400).send({ error: "Líder não existe." });
    }

    const code = crypto.randomBytes(5).toString('hex');

    const activity = await Activity.create({
      title,
      code,
      leaderId,
      challenges
    });

    leader.activities.push(activity);
    await leader.save(); 

    return res.json({ message: "Atividade criada!" });
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
