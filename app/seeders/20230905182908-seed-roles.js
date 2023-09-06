'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  development: {
    dialect: 'mysql', // Specify your database dialect here
    // Other database connection settings
  },
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Subscriber',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more initial data as needed
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
