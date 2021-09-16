const Journey = require("../models/Journey");
const Team = require("../models/Team");
const Form = require("../models/Form");
const Challenge = require("../models/Challenge");
const FormResponse = require("../models/FormResponse");
const normalize = require("../utils/normalize");
const admin = require("firebase-admin");
const uploadImageToStorage = require('../utils/uploadImageToStorage');
const { find } = require("../models/Journey");

module.exports = {
  async view(req, res) {
    const { authId } = req;
    const { slug } = req.params;
    const journey = await Journey.findOne({slug})
    const forms = await Form.aggregate([
      {
        $lookup: {
          from: Challenge.collection.name,
          localField: "challenge_id",
          foreignField: "_id",
          as: "challenge"
        }
      },
      {
        $match: {
          'challenge.journey_id': journey._id
        }
      },
      {
        $project: {
          "_id": 1,
          "items": 1,
          "title": 1,
          "start": 1,
          "end": 1,
          "challenge_id": 1,
        }
      }
    ])

    const team = await Team.findOne({ users: authId });
    const responses = await FormResponse.aggregate([
      {
        $lookup: {
          from: Challenge.collection.name,
          localField: "challenge_id",
          foreignField: "_id",
          as: "challenge"
        }
      },
      {
        $match: {
          'challenge.journey_id': journey._id
        }
      }
    ])

    let total = 0;

    for (let indexForm = 0; indexForm < forms.length; indexForm++) {
      for (let indexResponses = 0; indexResponses < responses.length; indexResponses++) {
        const a = JSON.stringify(forms[indexForm]._id);
        const b = JSON.stringify(responses[indexResponses].form_id);
        if ( a == b ) {
          total++
        }
      }
    }

  
    const progress = (total * 100) / forms.length

    console.log('forms ', forms.length)
    console.log('responses ', responses.length)
    console.log('progress ', progress)

    return res.json(progress);
  },
};
