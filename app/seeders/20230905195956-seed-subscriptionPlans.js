'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subscriptionplans', [
      {
        id: 1,
        name: 'Senpai',
        price: 2.99 ,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Sensei',
        price: 7.99 ,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Sama',
        price: 19.99 ,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more initial data as needed
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subscriptionplans', null, {});
  }
};
