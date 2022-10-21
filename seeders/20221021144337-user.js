'use strict';

const crypto  = require('crypto');
const secret  = process.env.PASSWORD_SECRET;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: crypto.createHmac('sha256', secret).update('admin').digest('hex'),
    }, {
      username: 'edi',
      password: crypto.createHmac('sha256', secret).update('edi').digest('hex'),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
