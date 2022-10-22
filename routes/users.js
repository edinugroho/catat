var express = require('express');
var router = express.Router();
const validator = require('../validator/user')

const {
  register
} = require('../controllers/user');

router.post('/register', validator.register, register);

module.exports = router;
