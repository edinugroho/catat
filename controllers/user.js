const model = require('../models');
const crypto  = require('crypto');
const secret  = process.env.PASSWORD_SECRET;

const register = (req, res) => {
  const user = {
    username : req.body.username,
    password : crypto.createHmac('sha256', secret).update(req.body.password).digest('hex'),
  }

  model.User.create(user).then(data => {
    res.status(201);
    res.json({
      "status" : "success",
      "data" : data
    });
  }).catch((err) => {
    res.status(422);
    res.json({
      "status" : "error",
      "message" : err.message
    });
  });
}; 

module.exports = {
  register
}
