const mongoose = require('mongoose');
const Team = require("../models/Team");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const Response = require("../models/Response");
const admin = require("firebase-admin");

module.exports = {
  async team(req, res) {
    const { authId } = req;
    const { trailId } = req.params;

    const team = await Team.findOne({ users: authId, trailId });

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

  async user(req, res) {
    const { email } = req.body;

    await admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        return res.status(400).send({ error: "Erro ao buscar dados." })
      });
  },

  async trail(req, res) {
    const { code } = req.params;

    const trail = await Trail.findOne({ code }).populate('challenges');

    const leader = await Leader.findById(trail.leaderId);

    const user = await admin
      .auth()
      .getUser(leader.uid)

    const newTrail = {...trail.toObject()};

    newTrail.leader = user.displayName;

    return res.json(newTrail);
  },

  async trails(req, res) {
    const { authId } = req;

    const trails = await Trail.aggregate([
      {
        $lookup: {
          from: Leader.collection.name,
          localField: "leaderId",
          foreignField: "_id",
          as: "leader"
        }
      },
      {
        $unwind: "$leader"
      },
      {
        $lookup: {
          from: Team.collection.name,
          localField: "_id",
          foreignField: "trailId",
          as: "team"
        }
      },
      {
        $unwind: "$team"
      },
      {
        $match: {
          $or:[
            {'team.users': authId},
            {'leader.uid': authId}
          ]
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
          'team._id': 1,
          'team.leaderId': 1,
          'team.users': 1
        }
      }
    ])  

    //const newTrails = [...trails];

    // newTrails.forEach(item => item.team.leaderId) // buscar o uid do leader ou adicionar no agreggate?

    return res.json(trails);

  },

  async responses(req, res) {
    const { authId } = req;
    const { trailId } = req.params;

    const team = await Team.findOne({ users: authId, trailId });
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
    const { trailId } = req.params;

    const trailExists = await Trail.findById(trailId)

    if (!trailExists) {
      return res.status(400).send({ error: "Atividade não existe." });
    }

    const trail = mongoose.Types.ObjectId(trailId);

    const teams = await Team.aggregate([
      {
        $match: {
          'trailId': trail
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
