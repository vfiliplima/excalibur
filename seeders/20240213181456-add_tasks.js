"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Tasks",
      [
        {
          summary: "squats",
          status: "incomplete",
          technicianId: 4,
          managerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          summary: "pushes",
          status: "incomplete",
          technicianId: 4,
          managerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          summary: "pulls",
          status: "incomplete",
          technicianId: 4,
          managerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          summary: "lunges",
          status: "incomplete",
          technicianId: 4,
          managerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          summary: "twists",
          status: "incomplete",
          technicianId: 4,
          managerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
