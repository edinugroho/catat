const model = require('../models');
const crypto  = require('crypto');
const secret  = process.env.PASSWORD_SECRET;
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

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

const login = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  model.User.findOne({
    where: {
      username: req.body.username,
      password: crypto.createHmac('sha256', secret).update(req.body.password).digest('hex')
    },
    attributes: ['id', 'username']
  }).then(data => {
    if (data) {
      let token = jwt.sign({
        id: data.id,
        username: data.username
      }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({
        "status" : "success",
        "data" : { 
          "user" : data,
          token : `Bearer ${token}`
        }
      });
    } else {
      res.json({
        "status" : "error",
        "message" : "user not found!"
      });
    }
  });
}

const index = (req, res) => {
  res.json(req.user);
}

const update = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  model.User.update({ 
    username : req.body.username,
    password: crypto.createHmac('sha256', secret).update(req.body.password).digest('hex')
  }, {
    where :{ id : req.user.id }
  }).then(() => {
    req.logout(() => {
      res.status(201);
      res.json({
        "status" : "success",
        "message" : "user updated"
      });
    });
  }).catch((err) => {
    res.status(422);
    res.json({
      "status" : "error",
      "message" : err.message
    });
  });
}

module.exports = {
  register,
  login,
  index,
  update
}
