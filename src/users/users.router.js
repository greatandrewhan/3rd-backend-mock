const router = require("express").Router();
const controller = require("./users.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Add the appropriate methods in this file

//route POST /users
router.route("/").post(controller.create).all(methodNotAllowed);

// GET /users/:userId
router.route("/:userId").get(controller.read).all(methodNotAllowed);

module.exports = router;
