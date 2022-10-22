var express = require('express');
var router = express.Router();
const validator = require('../validator/transaction')
const passport = require('passport');

const {
  store
} = require('../controllers/transaction');

router.post('/', passport.authenticate('jwt', { session: false }), validator.store, store);

module.exports = router;
