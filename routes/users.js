var express = require('express');
var router = express.Router();
const validator = require('../validator/user')
const passport = require('passport');

const {
  register,
  login,
  index,
  update
} = require('../controllers/user');

router.post('/register', validator.register, register);
router.post('/login', validator.login, login);
router.get('/', passport.authenticate('jwt', { session: false }), index);
router.patch('/', passport.authenticate('jwt', { session: false }), validator.register, update);

module.exports = router;
