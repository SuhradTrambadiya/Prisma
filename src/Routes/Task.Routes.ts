import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  getTasksForUser,
  createTaskForAllUsers,
  getUsersForTask
} from "../Controller/Task.Controller";

const router = Router();

// Create Task
router.post("/", createTask);

// Get All Tasks
router.get("/", getAllTasks);

// Get Task by ID
router.get("/:id", getTaskById);

// Update Task by ID
router.patch("/:id", updateTaskById);

// Get All Tasks for a Specific User
router.get("/user/:userId", getTasksForUser);

// Add Task for All Users
router.post("/all-users", createTaskForAllUsers);

// Get All Users for a Specific Task
router.get("/:id/users", getUsersForTask);

export default router;
