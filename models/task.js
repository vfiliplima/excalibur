"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: "technicianId",
        as: "technician",
      });
    }
  }
  Task.init(
    {
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [0, 2500], // Maximum length allowed
        },
      },
      status: {
        type: DataTypes.ENUM("incomplete", "in progress", "completed"),
        allowNull: false,
        defaultValue: "incomplete",
      },
      completionDate: { type: DataTypes.DATE, allowNull: true },
      technicianId: { type: DataTypes.INTEGER, allowNull: false },
      managerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
