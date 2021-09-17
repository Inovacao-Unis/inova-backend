const Category = require("../models/Category");
const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Activity = require("../models/Activity");
const Response = require("../models/Response");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const response = await Response.findById(id);

    return res.json(response);
  },

  async list(req, res) {
    const responses = await Response.find();
    return res.json(responses);
  },

  async create(req, res) {
    const { response, stage, teamId, challengeId, activityId } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(400).send({ error: "Time não existe" });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(400).send({ error: "Desafio não existe" });
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(400).send({ error: "Atividade não existe" });
    }

    if (stage < 1 || stage > 4) {
      return res.status(400).send({ error: "Essa etapa não existe" });
    }

    await Response.create({
      response,
      stage,
      teamId,
      challengeId,
      activityId,
    });

    return res.json({ message: "Resposta enviada!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Response.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Response.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
