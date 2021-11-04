const mongoose = require('mongoose');
const Team = require("../models/Team");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const Response = require("../models/Response");
const admin = require("firebase-admin");
const { response } = require('express');

module.exports = {
  async teams(req, res) {
    const { trailId } = req.params;

    const teams = await Team.find({ trailId }).lean();

    if (!teams || !(teams.length > 0)) {
      return res.json([]);
    }

    const responses = await Response.find({teamId: teams[0]._id});
    

    for (const team of teams) {
      const responses = await Response.find({teamId: team._id}).lean();

      for (const response of responses) {
        const points = await Point.findOne({ responseId: response._id })
        response["points"] = points;
      }
      team["responses"] = responses;

    }

    return res.json(teams);
  },

  
};
