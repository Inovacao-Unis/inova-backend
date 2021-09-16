const AllowedEmail = require("../models/AllowedEmail");

module.exports = {
  async check(req, res) {
    return res.json({ message: "success" });
  },

  async registerEmail(req, res) {
    const { email } = req.body;

    const exists = await AllowedEmail.findOne({ email });

    if (exists) {
      return res.status(400).send({
        error: "Email já cadastrado",
      });
    }

    const result = await AllowedEmail.create({ email });

    res.json(result);
  },

  async allowedEmails(req, res) {
    const emails = await AllowedEmail.find();
    res.json(emails);
  },
};
