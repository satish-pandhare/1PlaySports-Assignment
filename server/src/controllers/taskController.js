const prisma = require("../services/db");

/**
 * Get all tasks for authenticated user
 * Supports filtering by status and pagination
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    // Build where clause
    const where = { userId };
    if (status) {
      // Convert status to uppercase to match enum
      const statusUpper = status.toUpperCase().replace("-", "_");
      if (["TODO", "IN_PROGRESS", "DONE"].includes(statusUpper)) {
        where.status = statusUpper;
      }
    }

    // Parse pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get tasks and count in parallel
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.userId;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.userId;

    // Check task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
