var express = require('express');
var router = express.Router();
const validator = require('../validator/transaction')
const passport = require('passport');

const {
  store,
  update,
  destroy,
  index
} = require('../controllers/transaction');

router.post('/', passport.authenticate('jwt', { session: false }), validator.store, store);
router.patch('/:id', passport.authenticate('jwt', { session: false }), validator.store, update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), destroy);
router.get('/', passport.authenticate('jwt', { session: false }), index);

module.exports = router;
