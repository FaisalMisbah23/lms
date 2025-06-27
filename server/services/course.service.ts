import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import Course from "../models/course.model";

// create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await Course.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get all courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    courses,
  });
};
