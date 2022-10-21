'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transactions', [{
      id_user: 1,
      amount: 100000,
      notes: 'beli pulsa',
      date: '2022-10-21',
      type: 'expense'
    }, {
      id_user: 1,
      amount: 50000,
      notes: 'jual buku',
      date: '2022-10-22',
      type: 'income'
    }, {
      id_user: 2,
      amount: 200000,
      notes: 'beli listrik',
      date: '2022-10-23',
      type: 'expense'
    }, {
      id_user: 2,
      amount: 1000000,
      notes: 'jual sepeda',
      date: '2022-10-24',
      type: 'income'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
