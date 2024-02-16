const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const passport = require("../middleware/passport");

router.get(
  "/tasks",
  passport.authenticate("jwt", { session: false }),
  taskController.listTasks
);
router.post(
  "/tasks",
  passport.authenticate("jwt", { session: false }),
  taskController.createTask
);

router.get(
  "/tasks/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.detailTask
);
router.patch(
  "/tasks/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTask
);

router.delete(
  "/tasks/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.deleteTask
);

module.exports = router;
