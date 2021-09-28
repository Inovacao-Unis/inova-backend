const mongoose = require('mongoose');
const Team = require("../models/Team");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Activity = require("../models/Activity");
const Response = require("../models/Response");
const admin = require("firebase-admin");

module.exports = {
  async team(req, res) {
    const { authId } = req;
    const { activityId } = req.params;

    const team = await Team.findOne({ users: authId, activityId });

    const result = JSON.parse(JSON.stringify(team));

    const points = await Point.find({ teamId: team._id });

    if (points && points.length > 0) {
      result.points = points.reduce((total, element) => total.value + element.value);
    } else {
      result.points = 0;
    }

    const responses = await Response.find({ teamId: team._id });

    result.progress = (responses.length * 100) / 4;

    return res.json(result);
  },

  async activities(req, res) {
    const { authId } = req;

    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: Team.collection.name,
          localField: "_id",
          foreignField: "activityId",
          as: "team"
        }
      },
      {
        $unwind: "$team"
      },
      {
        $match: {
          'team.users': authId
        }
      },
      {
        $project: {
          '_id': 1,
          'challenges': 1,
          'title': 1,
          'code': 1,
          'leaderId': 1,
          'isActive': 1,
          'team.name': 1,
          'team._id': 1
        }
      }
    ])  

    return res.json(activities);

  },

  async responses(req, res) {
    const { authId } = req;
    const { activityId } = req.params;

    const team = await Team.findOne({ users: authId, activityId });
    const responses = await Response.find({ teamId: team._id });

    const result = {
      1: false,
      2: false,
      3: false,
      4: false
    };

    responses.forEach(response => {
      result[response.stage] = true
    })
    

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

    return res.json(teams);
  },
};
