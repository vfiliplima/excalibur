const serializeUser = require("../serializers/userSerializer");
const models = require("../../models");

exports.listUsers = async (req, res) => {
  const users = await models.User.findAll({
    include: [
      { model: models.Role, as: "role" },
      { model: models.Task, as: "tasks" },
    ],
  });
  serializedUsers = users.map((user) => serializeUser(user));
  res.json(serializedUsers);
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, age, password, roleName } = req.body;

    const roleID = await models.Role.findOne({
      where: { name: roleName },
    }).then((r) => r.id);

    if (!roleID) {
      return res.status(400).json({ message: "Role not found" });
    }

    const date = new Date();
    const user = await models.User.create({
      firstName: firstName,
      lastName: lastName,
      age: age,
      password: password,
      roleId: roleID,
      createdAt: date,
      updatedAt: date,
    });
    res.status(201).json({
      statusCode: 201,
      message: "User created successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await models.User.findByPk(id, {
      include: [
        { model: models.Role, as: "role" },
        { model: models.Task, as: "tasks" },
        { model: models.User, as: "manager" },
        { model: models.User, as: "technicians" },
      ],
    });
    res.json(serializeUser(user));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, age, password } = req.body;
    const user = await models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user properties
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.password = password;

    // Save the updated user to the database
    await user.save();

    // Serialize the updated user and send it in the response
    const serializedUser = serializeUser(user);
    res.json(serializedUser);
  } catch (error) {
    res.status(404).json({ error: "bad Request" });
  }
};
