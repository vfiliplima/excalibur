const serializeRole = require("../serializers/roleSerializer");
const models = require("../../models");

exports.listRoles = async (req, res) => {
  const roles = await models.Role.findAll();
  serializedRoles = roles.map((role) => serializeRole(role));
  res.json(serializedRoles);
};
