import { Request, Response } from "express";
import prisma from "../DB/db.config";

// Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, userIds } = req.body;

    // Validate input
    if (!title || !description || !Array.isArray(userIds) || !userIds.length) {
      return res.status(400).json({
        CustomMessage: "Title, description, and at least one user ID are required.",
      });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status ?? false,
        users: {
          connect: userIds.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(201).json({
      message: "Task created and assigned successfully",
      task: newTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while creating a task",
    });
  }
};

// Get All Tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const allTasks = await prisma.task.findMany();

    if (allTasks.length === 0) {
      return res.status(404).json({
        CustomMessage: "No tasks found.",
      });
    }

    return res.status(200).json({
      message: "Here are all the tasks",
      tasks: allTasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while retrieving all tasks",
    });
  }
};

// Get Task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        CustomMessage: "Task ID is required.",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        CustomMessage: "Task not found.",
      });
    }

    return res.status(200).json({
      message: `Here is the task with ID ${id}`,
      task,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while retrieving the task by ID",
    });
  }
};

// Update Task by ID
export const updateTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!id || (!title && !description && status === undefined)) {
      return res.status(400).json({
        CustomMessage: "ID and at least one field to update (title, description, or status) are required.",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });

    return res.status(200).json({
      message: `Task with ID ${id} updated successfully`,
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while updating the task by ID",
    });
  }
};

// Get All Tasks for a Specific User
export const getTasksForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        CustomMessage: "User ID is required.",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).json({
      message: `Tasks for user ${userId}`,
      tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while retrieving tasks for user.",
    });
  }
};

// Add Task for All Users
export const createTaskForAllUsers = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        CustomMessage: "Title and description are required.",
      });
    }

    // Fetch all user IDs
    const users = await prisma.user.findMany();
    const userIds = users.map(user => user.id);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status ?? false,
        users: {
          connect: userIds.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(201).json({
      message: "Task created and assigned to all users successfully",
      task: newTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while creating task for all users",
    });
  }
};


// Get All Users for a Specific Task
export const getUsersForTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        CustomMessage: "Task ID is required.",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: { users: true }, // Assuming the relationship is named 'users'
    });

    if (!task) {
      return res.status(404).json({
        CustomMessage: "Task not found.",
      });
    }

    return res.status(200).json({
      message: `Users assigned to task with ID ${id}`,
      users: task.users,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      CustomMessage: "Error while retrieving users for the task",
    });
  }
};
