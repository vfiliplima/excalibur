const serializeTask = (task) => {
  if (!task) {
    return null;
  }

  return {
    id: task.id,
    summary: task.summary,
    status: task.status,
    completionDate: task.completionDate,
    technician: task.technician
      ? `${task.technician.firstName} ${task.technician.lastName}`
      : task.technicianId,
  };
};

module.exports = serializeTask;
