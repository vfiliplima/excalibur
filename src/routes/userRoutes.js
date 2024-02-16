const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.listUsers);

router.post("/users", userController.createUser);

router.get("/users/:id", userController.userDetail);
router.put("/users/:id", userController.updateUser);

module.exports = router;
