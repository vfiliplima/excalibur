const serializeTask = require("./taskSerializer");

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  const {
    id,
    firstName,
    lastName,
    age,
    username,
    role,
    manager,
    joinDate,
    updatedAt,
    tasks,
    technicians,
  } = user;

  const managerName = manager
    ? `${manager.firstName} ${manager.lastName}`
    : null;
  const formattedJoinDate = joinDate
    ? joinDate.toISOString().split("T")[0]
    : null;

  const serializeTechnicians = (technicians) => {
    return technicians.map((tech) => {
      return {
        id: tech.id,
        name: `${tech.firstName} ${tech.lastName}`,
        age: tech.age,
      };
    });
  };

  const serializedUser = {
    id,
    firstName,
    lastName,
    age,
    role: role.name,
    username,
    joinDate: formattedJoinDate,
    updatedAt: updatedAt.toISOString(),
    tasks: tasks.map((task) => serializeTask(task)),
  };

  // Include technicians if user is a manager
  if (role.name === "manager" && technicians) {
    serializedUser.technicians = serializeTechnicians(technicians);
  }

  // Include manager if user is a technician
  if (role.name === "technician" && manager) {
    serializedUser.manager = managerName;
  }

  return serializedUser;
};

module.exports = serializeUser;
