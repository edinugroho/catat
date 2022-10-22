const { check } = require('express-validator');

const store = [
  check('amount')
    .not().isEmpty().withMessage('amount field is required').bail()
    .isInt().withMessage('ammount field should be numeric').bail()
    .isInt({min: 1}).withMessage('ammount field should be positive number').bail(),
  check('date')
    .not().isEmpty().withMessage('date field is required').bail()
    .custom(value => {
      const enteredDate=new Date(value);
      const todaysDate=new Date();
      if(enteredDate>todaysDate){
          throw new Error("date can not greather than today");
      }
      return true;
    }),
  check('type')
    .not().isEmpty().withMessage('type field is required').bail()
    .isIn(['expense', 'income']).withMessage('invalid type')
];

module.exports = {
  store
}
