const {createTask, getTasks, updateTask} = require("../controller/taskApiController.js");
const express = require("express");
const router = express.Router();

router.route("/tasks", (request, response, next) =>{
    next();
})
 .post(createTask)
 .get(getTasks);

router.route("/tasks/:id", (request, response, next) => {
    next();
})
    .get(getTasks);

router.route("/tasks/:id", (request, response, next) => {
    next();
})
    .patch(updateTask);

module.exports = router;