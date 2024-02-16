const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.get("/roles", roleController.listRoles);

module.exports = router;
