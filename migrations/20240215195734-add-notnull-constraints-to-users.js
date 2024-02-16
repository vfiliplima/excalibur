"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "age", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "joinDate", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "roleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "age", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "joinDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "roleId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
