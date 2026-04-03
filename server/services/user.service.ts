import { Response } from "express";
import User from "../models/user.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  let userJson;
  try {
    userJson = await redis.get(id);
  } catch (cacheError) {
    console.warn("Redis read failed in getUserById:", cacheError);
  }

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  } else {
    try {
      const user = await User.findById(id);
      if (user) {
        res.status(201).json({
          success: true,
          user,
        });
        redis.set(id, JSON.stringify(user)).catch((e) =>
          console.warn("Redis write failed in getUserById:", e)
        );
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error: any) {
      console.warn("Database fallback failed in getUserById:", error);
      res.status(500).json({
        success: false,
        message: error?.message || "Failed to retrieve user",
      });
    }
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
