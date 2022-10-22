const { check } = require('express-validator');

const register = [
  check('username')
    .not().isEmpty().withMessage('username field is required').bail()
    .isLength({min: 3}).withMessage('username field minimum 3 character').bail()
    .custom(value => !/\s/.test(value)).withMessage('username should be string only'),
  check('password')
    .not().isEmpty().withMessage('password field is required').bail()
    .isLength({min: 6}).withMessage('password field minimum 6 character')
];

module.exports = {
  register
}
