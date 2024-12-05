const express = require("express");
const route = express.Router();
const controller = require("./controller.js");

route.get("/", controller.getAll);
route.get("/:id", controller.get);
route.post("/", controller.save);
route.delete("/:id", controller.delete);
route.put("/:id", controller.update);

module.exports = route;