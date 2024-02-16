"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      User.belongsTo(User, {
        foreignKey: "managerId",
        as: "manager",
      });
      User.hasMany(User, {
        foreignKey: "managerId",
        as: "technicians",
      });
      User.hasMany(models.Task, {
        foreignKey: "technicianId",
        as: "tasks",
      });
    }
  }
  User.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
      joinDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      password: { type: DataTypes.STRING, allowNull: false },
      username: {
        type: DataTypes.STRING,
      },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      managerId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          user.username = generateUsername(user);
          user.joinDate = setJoinDate();
          await hashPassword(user);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            await hashPassword(user);
          }
        },
      },
    }
  );

  const hashPassword = async (user) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  };

  const generateUsername = (user) => {
    const username =
      user.firstName.charAt(0).toLowerCase() + user.lastName.toLowerCase();
    return username;
  };

  return User;
};
