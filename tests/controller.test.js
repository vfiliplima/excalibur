const taskController = require("../src/controllers/taskController");
const models = require("../models");
const serializeTask = require("../src/serializers/taskSerializer");

describe("listTasks", () => {
  it("should return an array of tasks for a technician", async () => {
    // Mock req.user
    const req = { user: { id: 1 } };
    const res = { json: jest.fn() };

    // Mock models.Task.findAll to return tasks
    models.Task.findAll = jest.fn().mockResolvedValue([
      {
        id: 1,
        summary: "Task 1",
        technicianId: 1,
        completionDate: null,
        status: "incomplete",
      },
      {
        id: 2,
        summary: "Task 2",
        technicianId: 1,
        completionDate: null,
        status: "incomplete",
      },
    ]);

    await taskController.listTasks(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        summary: "Task 1",
        technician: 1,
        completionDate: null,
        status: "incomplete",
      },
      {
        id: 2,
        summary: "Task 2",
        technician: 1,
        completionDate: null,
        status: "incomplete",
      },
    ]);
  });

  it("should return an empty array if no tasks are found for a technician", async () => {
    // Mock req.user
    const req = { user: { id: 1 } };
    const res = { json: jest.fn() };

    // Mock models.Task.findAll
    models.Task.findAll = jest.fn().mockResolvedValue([]);

    await taskController.listTasks(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should handle errors and return a 500 status code", async () => {
    // Mock req.user
    const req = { user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock models.Task.findAll
    models.Task.findAll = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await taskController.listTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("detailTask", () => {
  it("should return details of a specific task for a technician", async () => {
    // Mock request and response objects
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = { json: jest.fn() };

    // Mock Task.findByPk to return a task
    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Task 1",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
    });

    await taskController.detailTask(req, res);

    expect(res.json).toHaveBeenCalledWith(
      serializeTask({
        id: 1,
        summary: "Task 1",
        status: "incomplete",
        completionDate: null,
        technicianId: 1,
      })
    );
  });

  it("should return details of a specific task for a manager", async () => {
    // Mock request and response objects
    const req = { params: { id: 1 }, user: { id: 2 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    // Mock Task.findByPk to return a task
    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Task 1",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
      managerId: 2,
    });

    await taskController.detailTask(req, res);

    expect(res.json).toHaveBeenCalledWith(
      serializeTask({
        id: 1,
        summary: "Task 1",
        status: "incomplete",
        completionDate: null,
        technicianId: 1,
        managerId: 2,
      })
    );
  });

  it("should return 404 if task is not found", async () => {
    // Mock request and response objects
    const req = { params: { id: 999 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk
    models.Task.findByPk = jest.fn().mockResolvedValue(null);

    await taskController.detailTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Task with id 999 not found",
    });
  });

  it("should return 401 if user is not authorized to view the task", async () => {
    // Mock request and response objects
    const req = { params: { id: 1 }, user: { id: 2, managerId: 999 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to return a task with different managerId
    models.Task.findByPk = jest
      .fn()
      .mockResolvedValue({ id: 1, summary: "Task 1", managerId: 1 });

    await taskController.detailTask(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized: You do not have access rights to this task",
    });
  });

  it("should handle database errors and return a 500 status code", async () => {
    // Mock request and response objects
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to throw an error
    models.Task.findByPk = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await taskController.detailTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("updateTask", () => {
  it("should update the task when all fields are provided", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: {
        summary: "Updated summary",
        status: "in progress",
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Original summary",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
      save: jest.fn().mockResolvedValue(),
    });

    await taskController.updateTask(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      summary: "Updated summary",
      status: "in progress",
      completionDate: null,
      technician: 1,
    });
  });

  it("should update only the summary when only summary is provided", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { summary: "Updated summary" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Original summary",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
      save: jest.fn().mockResolvedValue(),
    });

    await taskController.updateTask(req, res);

    expect(models.Task.findByPk).toHaveBeenCalledWith(1, {
      include: [{ as: "technician", model: models.User }],
    });
    expect(res.json).toHaveBeenCalledWith(
      serializeTask({
        id: 1,
        summary: "Updated summary",
        status: "incomplete",
        completionDate: null,
        technicianId: 1,
      })
    );
  });

  it("should update status and completionDate when only status is provided", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { status: "completed" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Original summary",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
      technician: { firstName: "John", lastName: "Doe" },
      save: jest.fn().mockResolvedValue(),
    });

    await taskController.updateTask(req, res);

    expect(models.Task.findByPk).toHaveBeenCalledWith(1, {
      include: [{ as: "technician", model: models.User }],
    });
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      summary: "Original summary",
      status: "completed",
      completionDate: expect.any(Date),
      technician: "John Doe",
    });
  });

  it("should update task status to completed and log a notification", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { status: "completed" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    const task = {
      id: 1,
      summary: "Task summary",
      status: "in progress",
      completionDate: null,
      technicianId: 1,
      technician: { id: 1, firstName: "John", lastName: "Doe" },
      save: jest.fn().mockResolvedValue(),
    };

    models.Task.findByPk = jest.fn().mockResolvedValue(task);

    const consoleSpy = jest.spyOn(console, "log");

    await taskController.updateTask(req, res);

    expect(consoleSpy).toHaveBeenCalledWith(
      `The tech ${task.technician.firstName} ${task.technician.lastName} performed the task ${task.summary} on date ${task.completionDate}`
    );
  });

  it("should return 401 Unauthorized if user is not authorized to update the task", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 2 },
      body: { summary: "Updated summary" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to return a task
    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      summary: "Original summary",
      status: "incomplete",
      completionDate: null,
      technicianId: 1,
    });

    await taskController.updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});

describe("createTask", () => {
  it("should create a task when summary is provided", async () => {
    // Mock request and response objects
    const req = {
      body: { summary: "New task summary" },
      user: { id: 1, managerId: 2 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.create to return a task with an id
    models.Task.create = jest.fn().mockResolvedValue({
      id: 1,
      summary: "New task summary",
      technicianId: 1,
      managerId: 2,
    });

    await taskController.createTask(req, res);

    // Ensure task was created and returned in response
    expect(models.Task.create).toHaveBeenCalledWith({
      summary: "New task summary",
      technicianId: 1,
      managerId: 2,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      serializeTask({
        id: 1,
        summary: "New task summary",
        technicianId: 1,
      })
    );
  });

  it("should return an error if summary is not provided", async () => {
    // Mock request and response objects
    const req = { body: {}, user: { id: 1, managerId: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await taskController.createTask(req, res);

    // Ensure an error is returned
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Summary is required" });
  });

  it("should return an error if Task.create throws an error", async () => {
    // Mock request and response objects
    const req = {
      body: { summary: "New task summary" },
      user: { id: 1, managerId: 2 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.create to throw an error
    models.Task.create = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await taskController.createTask(req, res);

    // Ensure an error is returned
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

describe("deleteTask", () => {
  it("should delete the task if it exists and user is the manager", async () => {
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to return a task
    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      managerId: 1,
      destroy: jest.fn().mockResolvedValue(true),
    });

    await taskController.deleteTask(req, res);

    // Ensure task was deleted
    expect(models.Task.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task with ID 1 was successfully deleted.",
    });
  });

  it("should return 404 if task does not exist", async () => {
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to return null
    models.Task.findByPk = jest.fn().mockResolvedValue(null);

    await taskController.deleteTask(req, res);

    // Ensure status 404 is returned
    expect(models.Task.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Not Found: Task with ID 1 does not exist.",
    });
  });

  it("should return 401 if user is not the manager of the task", async () => {
    const req = { params: { id: 1 }, user: { id: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock Task.findByPk to return a task with a different managerId
    models.Task.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      managerId: 1,
    });

    await taskController.deleteTask(req, res);

    // Ensure status 401 is returned
    expect(models.Task.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized: You do not have permission to delete this task.",
    });
  });
});
