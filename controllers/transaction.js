const model = require('../models');
const { validationResult } = require('express-validator');

const store = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const transaction = {
    id_user : req.user.id,
    amount : req.body.amount,
    notes : req.body.notes,
    date : req.body.date,
    type : req.body.type,
  }

  model.Transaction.create(transaction).then(data => {
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
}

module.exports = {
  store
}
