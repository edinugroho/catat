const model = require('../models');
const { validationResult } = require('express-validator');
const moment = require('moment');
const Op = model.Sequelize.Op;

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

const update = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  model.Transaction.findByPk(req.params.id).then(result => {
    if (!result) {
      res.status(404);
      res.json({
        "status" : "error",
        "message" : "Transaction not found"
      });
    } else {
      result.set({
        amount : req.body.amount,
        notes : req.body.notes,
        date : req.body.date,
        type : req.body.type,
      })
      result.save().then(() => {
        res.status(201);
        res.json({
          "status" : "success",
          "message" : "Transaction updated"
        });
      }).catch((err) => {
        res.status(422);
        res.json({
          "status" : "error",
          "message" : err.message
        });
      });
    } 
  });
}

const destroy = (req, res) => {
  model.Transaction.findByPk(req.params.id).then(data => {
    if (!data) {
      res.status(404);
      res.json({
        "status" : "error",
        "message" : "Transaction not found"
      });
    } else {
      data.destroy()
      res.status(201);
      res.json({
        "status" : "success",
        "message" : "Transaction deleted"
      });
    }
  }).catch((err) => {
    res.status(422);
    res.json({
      "status" : "error",
      "message" : err.message
    });
  });
}

const index = (req, res) => {
  var where = {};

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

  const { page, size } = req.query;
  const { limit, offset } =  getPagination(page, size);

  if (req.query.type !== undefined) {
    where.type = {
      [Op.like]: `%${req.query.type ?? ''}%`
    }
  }

  if (req.query.start !== undefined && req.query.end !== undefined) {
    where.date = {
      [Op.between]: [moment(req.query.start).format('YYYY-MM-DD'), moment(req.query.end).format('YYYY-MM-DD')] 
    }
  }
  
  where.id_user = req.user.id
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: transactions } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, transactions, totalPages, currentPage };
  };

  model.Transaction.findAndCountAll({
    limit: limit,
    offset: offset,
  where: {
    [Op.and]: [where] 
  }
  }).then(data => {
    res.status(201);
    const response = getPagingData(data, page, limit);
    res.json({
      "status" : "success",
      "data" : response
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
  store,
  update,
  destroy,
  index
}
