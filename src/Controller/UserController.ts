import { Request, Response } from "express";
import prisma from "../DB/db.config";

export const createUser = async (req: Request, res: Response) => {
  try {
    // Get data from user
    const { name, email, password } = req.body;

    // Check all fields must be provided by the user
    if (!name || !email || !password) {
      return res.status(400).json({
        CustomMessage: "Name, email, and password are required.",
      });
    }

    // Check if email already exists
    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (checkEmail) {
      return res.status(400).json({
        CustomMessage: "Email is already in use.",
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: { name, email, password },
    });

    // Send success response
    return res.status(201).json({
      message: "User is created successfully",
      user: newUser,
    });
  } catch (error: any) {
    // Handle unexpected errors
    return res.status(500).json({
      ErrorMsg: error.message,
      CustomMessage: "An error occurred while creating the user.",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users
    const allUsers = await prisma.user.findMany();

    // Check if users are found
    if (allUsers.length === 0) {
      return res.status(404).json({
        CustomMessage: "No users are present in the table.",
      });
    }

    // Send success response
    return res.status(200).json({ allUsers });
  } catch (error: any) {
    // Handle unexpected errors
    return res.status(500).json({
      ErrorMsg: error.message,
      CustomMessage: "An error occurred while retrieving all users.",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.redirect("/");
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        CustomMessage: "User not found.",
      });
    }

    // Send success response with the user data
    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({
      ErrorMsg: error.message,
      CustomMessage: "An error occurred while retrieving the user by id.",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete user by ID
    await prisma.user.delete({
      where: { id },
    });

    // Send a successful response with no content
    return res.status(204).send(); // No content to return
  } catch (error: any) {
    // Handle errors (e.g., user not found)
    return res.status(500).json({
      ErrorMsg: error.message,
      CustomMessage: "An error occurred while deleting a user.",
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!id || (!name && !email && !password)) {
      return res.status(400).json({
        CustomMessage: "ID and at least one field to update (name, email, or password) are required.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
      },
    });

    // Send success response with the updated user data
    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      ErrorMsg: error.message,
      CustomMessage: "An error occurred while updating the user.",
    });
  }
};
