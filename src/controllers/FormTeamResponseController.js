const { findById } = require("../models/Form");
const Form = require("../models/Form");
const Team = require("../models/Team");
const FormItem = require("../models/FormItem");
const ItemChoice = require("../models/ItemChoice");
const FormResponse = require("../models/FormResponse");

module.exports = {
  async view(req, res) {
    const { authId } = req;
    const { form_id } = req.params;

    const team = await Team.findOne({ users: authId });

    const response = await FormResponse.findOne({
      $and: [{ form_id }, { team_id: team.id }],
    });

    return res.json(response);
  },

  async list(req, res) {
    const { authId } = req;
    const team = await Team.findOne({ users: authId });

    const responses = await FormResponse.find({team_id: team._id});

    return res.json(responses);
  },
};
