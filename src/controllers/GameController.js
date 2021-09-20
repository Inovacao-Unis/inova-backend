const mongoose = require('mongoose');
const Team = require("../models/Team");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Activity = require("../models/Activity");
const admin = require("firebase-admin");

module.exports = {
  async team(req, res) {
    const { authId } = req;
    const team = await Team.findOne({ users: authId });

    const points = await Point.find({ teamId: team._id });

    const result = JSON.parse(JSON.stringify(team));

    result.points = points.reduce((total, element) => total.value + element.value);

    return res.json(result);
  },

  async ranking(req, res) {
    const { activityId } = req.params;

    const activityExists = await Activity.findById(activityId)

    if (!activityExists) {
      return res.status(400).send({ error: "Atividade não existe." });
    }

    const activity = mongoose.Types.ObjectId(activityId);

    const teams = await Team.aggregate([
      {
        $match: {
          'activityId': activity
        }
      },
      {
        $lookup: {
          from: Point.collection.name,
          localField: "_id",
          foreignField: "teamId",
          as: "pointsTeam"
        }
      },
      {
        "$addFields": {
          "points": {
            "$reduce": {
              "input": "$pointsTeam",
              "initialValue": 0,
              "in": { "$add" : ["$$value", "$$this.value"] }
            }
          }
        }
      },
      {
        $sort: { "points": -1 }
      },
      {
        $project: {
          "points": 1,
          "_id": 1,
          "name": 1,
          "avatar": 1
        }
      }
      
    ])

    console.log('result ', teams)

    return res.json(teams);
  },
};
