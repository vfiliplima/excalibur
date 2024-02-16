const models = require("../../models");
const serializeTask = require("../serializers/taskSerializer");

exports.listTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await models.Task.findAll({
      where: {
        [models.Sequelize.Op.or]: [
          { technicianId: userId },
          { managerId: userId },
        ],
      },
    });

    const serializedTasks = tasks.map((task) => serializeTask(task));
    res.json(serializedTasks);
  } catch (error) {
    console.log("Error retrieving tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.detailTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await models.Task.findByPk(id, {
      include: [{ model: models.User, as: "technician" }],
    });
    if (!task) {
      return res.status(404).json({ error: `Task with id ${id} not found` });
    }
    if (task.technicianId !== req.user.id && task.managerId !== req.user.id) {
      return res.status(401).json({
        error: `Unauthorized: You do not have access rights to this task`,
      });
    }

    res.json(serializeTask(task));
  } catch (error) {
    // console.log("Error retrieving task details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, status } = req.body;
    const task = await models.Task.findByPk(id, {
      include: [{ model: models.User, as: "technician" }],
    });
    let notify = false;

    if (!task) {
      return res.status(404).json({ error: `Task with id ${id} not found` });
    }
    if (task.technicianId !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let technicianFullName = "";

    if (status === "completed") {
      task.completionDate = new Date();
      technicianFullName = `${task.technician.firstName} ${task.technician.lastName}`;
      notify = true;
    }

    if (summary) task.summary = summary;
    if (status) task.status = status;

    await task.save();
    if (notify) {
      const notification = `The tech ${technicianFullName} performed the task ${task.summary} on date ${task.completionDate}`;
      console.log(notification);
    }
    res.json(serializeTask(task));
  } catch (error) {
    console.log("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) {
      return res.status(400).json({ error: "Summary is required" });
    }

    const task = await models.Task.create({
      summary,
      technicianId: req.user.id,
      managerId: req.user.managerId,
    });

    res.status(201).json(serializeTask(task));
  } catch (error) {
    console.log("Error creating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await models.Task.findByPk(id);

    if (!task) {
      return res
        .status(404)
        .json({ error: `Not Found: Task with ID ${id} does not exist.` });
    }

    if (req.user.id !== task.managerId) {
      return res.status(401).json({
        error: "Unauthorized: You do not have permission to delete this task.",
      });
    }

    await task.destroy();

    return res
      .status(200)
      .json({ message: `Task with ID ${id} was successfully deleted.` });
  } catch (error) {
    console.log("Error deleting task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
