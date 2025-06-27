import { Response } from "express";
import User from "../models/user.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// get all users
export const getAllUsersService = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (
  userId: string,
  role: string,
  res: Response
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      role,
    },
    { new: true }
  );

  if (user && user._id) {
    await redis.set(user._id.toString(), JSON.stringify(user));
  }
  res.status(201).json({
    success: true,
    user,
  });
};
