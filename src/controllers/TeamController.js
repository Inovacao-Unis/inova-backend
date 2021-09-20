const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Leader = require("../models/Leader");
const Activity = require("../models/Activity");
const admin = require("firebase-admin");

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
    const { name, challengeId, leaderId, users, activityId } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Informe o nome para continuar." });
    }

    const nameExists = await Team.findOne({ name });

    if (nameExists) {
      return res.status(400).send({ error: "Esse nome já está sendo usado" });
    }

    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res
        .status(400)
        .send({ error: "Não encontramos o responsável por esse desafio." });
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res
        .status(400)
        .send({ error: "Não existe essa atividade." });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(400).send({ error: "Esse desafio não existe." });
    }

    const team = await Team.create({
      name,
      challengeId,
      activityId,
      leaderId,
      users,
      username: "123"
    });

    leader.teams.push(team);
    await leader.save(); 

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
