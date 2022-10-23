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
      if (result.id_user != req.user.id) {
        res.status(401);
        res.json({
          "status" : "error",
          "message" : "Unauthorized"
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
      if (data.id_user != req.user.id) {
        res.status(401);
        res.json({
          "status" : "error",
          "message" : "Unauthorized"
        });
      } else {
        data.destroy()
        res.status(201);
        res.json({
          "status" : "success",
          "message" : "Transaction deleted"
        });
      }
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

  if (req.query.type) {
    where.type = {
      [Op.like]: `%${req.query.type ?? ''}%`
    }
  }

  if (req.query.start && req.query.end) {
    where.date = {
      [Op.between]: [moment(req.query.start).format('YYYY-MM-DD'), moment(req.query.end).format('YYYY-MM-DD')] 
    }
  }
  
  where.id_user = req.user.id
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: transactions } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const links = {
      first : `http://${req.get('host')}/transaction?page=0&size=${limit}&page=0&type=${req.query.type ?? ''}&start=${req.query.start ?? ''}&end=${req.query.end ?? ''}`,
      prev : `http://${req.get('host')}/transaction?page=${currentPage >= 0 ? 0 : currentPage - 1}&size=${limit}&page=0&type=${req.query.type ?? ''}&start=${req.query.start ?? ''}&end=${req.query.end ?? ''}`,
      next : `http://${req.get('host')}/transaction?page=${currentPage >= totalPages - 1 ? totalPages - 1 : currentPage + 1}&size=${limit}&page=0&type=${req.query.type ?? ''}&start=${req.query.start ?? ''}&end=${req.query.end ?? ''}`,
      last : `http://${req.get('host')}/transaction?page=${totalPages - 1}&size=${limit}&page=0&type=${req.query.type ?? ''}&start=${req.query.start ?? ''}&end=${req.query.end ?? ''}`,
    }
  
    return { totalItems, transactions, totalPages, currentPage, links};
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

const show = (req, res) => {
  model.Transaction.findByPk(req.params.id).then(data => {
    if (!data) {
      res.status(404);
      res.json({
        "status" : "error",
        "message" : "Transaction not found"
      });
    } else {
      if (data.id_user != req.user.id) {
        res.status(401);
        res.json({
          "status" : "error",
          "message" : "Unauthorized"
        });
      } else {
        res.status(201);
        res.json({
          "status" : "success",
          data
        });
      }
    }
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
  index,
  show
}
