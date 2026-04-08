const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const {
  validate,
  createTaskRules,
  updateTaskRules,
} = require("../middleware/validate");
const authenticate = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /tasks - Get all tasks (with optional filters)
router.get("/", getTasks);

// GET /tasks/:id - Get single task
router.get("/:id", getTask);

// POST /tasks - Create new task
router.post("/", validate(createTaskRules), createTask);

// PATCH /tasks/:id - Update task
router.patch("/:id", validate(updateTaskRules), updateTask);

// DELETE /tasks/:id - Delete task
router.delete("/:id", deleteTask);

module.exports = router;
