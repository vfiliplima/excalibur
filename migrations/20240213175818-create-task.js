"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [0, 2500],
        },
      },
      status: {
        type: Sequelize.ENUM("incomplete", "in progress", "completed"),
        allowNull: false,
        defaultValue: "incomplete",
      },
      completionDate: {
        type: Sequelize.DATE,
      },
      technicianId: {
        type: Sequelize.INTEGER,
      },
      managerId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
