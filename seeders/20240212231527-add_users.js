"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Afonso",
          lastName: "Henriques",
          age: "915",
          password: "pai de portugal",
          username: "ahenriques",
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Luis",
          lastName: "Camoes",
          age: "499",
          username: "lcamoes",
          password: "portugal epico",
          roleId: 1,
          managerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Vasco",
          lastName: "Gama",
          age: "564",
          username: "vgama",
          password: "os descobrimentos sao meus",
          roleId: 1,
          managerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Luis",
          lastName: "Figo",
          age: "51",
          username: "lfigo",
          password: "que pezinhos",
          roleId: 1,
          managerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
