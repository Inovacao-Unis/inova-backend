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

      let totalPoints = 0;

      for (const response of responses) {
        const points = await Point.findOne({ responseId: response._id })
        response["points"] = points;
        if (points?.value) {
          totalPoints += points.value;
        }
      }
      team["totalPoints"] = totalPoints;
      team["responses"] = responses;

      const users = [];

      team.users.forEach(uid => users.push({ uid }))

      await admin
        .auth()
        .getUsers(users)
        .then((usersResult) => {
          const usersList = usersResult.users.map(user => user.email)

          team["users"] = usersList;
        })
        .catch((error) => {
          console.log('error: ', error);
          return res.status(400).send({ error: "Erro ao buscar dados." })
        });

    }
    return res.json(teams);
  },

  async users(req, res) {
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
          "avatar": 1,
          "users": 1
        }
      }
      
    ])

    for (const team of teams) {
      const users = [];

      team.users.forEach(uid => users.push({ uid }))

      await admin
        .auth()
        .getUsers(users)
        .then((usersResult) => {
          const usersList = usersResult.users.map(user => (
            {
              displayName: user.displayName,
              email: user.email,
            }
          ))

          team["users"] = usersList;
        })
        .catch((error) => {
          console.log('error: ', error);
          return res.status(400).send({ error: "Erro ao buscar dados." })
        });

    }

    const response = [];

    for (const item of teams) {
      for (const user of item.users) {
        const obj = {
          displayName: user.displayName,
          email: user.email,
          points: (item.points * trailExists.note) / 100
        }
        response.push(obj)
      }
    }

    const responseSort = response.sort((a, b) => a.displayName > b.displayName ? 1 : ((b.displayName > a.displayName) ? -1 : 0));
    return res.json(responseSort);
  },

  
};
