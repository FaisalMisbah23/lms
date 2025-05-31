import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import Course from "../models/course.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";
import axios from "axios";

dotenv.config();

// create course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }
      const courseId = req.params.id;
      const course = await Course.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get single course without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCached = await redis.get(courseId);
      let course;
      if (isCached) {
        course = JSON.parse(isCached);
      } else {
        course = await Course.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(
          courseId,
          JSON.stringify(course),
          "EX",
          7 * 24 * 60 * 60
        );
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all courses without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCached = await redis.get("allCourses");
      let courses;
      if (isCached) {
        courses = JSON.parse(isCached);
      } else {
        courses = await Course.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set("allCourses", JSON.stringify(courses));
      }

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get course content for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExists = userCourseList?.find(
        (course) => course._id === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course!", 404)
        );
      }

      const course = await Course.findById(courseId);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add question in course
interface IQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IQuestionData;
      const course = await Course.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id!", 400));
      }

      const courseContent = course?.courseData.find((item) =>
        item.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id!", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      courseContent?.questions.push(newQuestion);

      await Notification.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent.title}`,
      });

      // save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add answer in course question
interface IAnswerData {
  answer: string;
  questionId: string;
  contentId: string;
  courseId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, questionId, contentId, courseId } =
        req.body as IAnswerData;
      const course = await Course.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id!", 400));
      }

      const courseContent = course?.courseData.find((item) =>
        item.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id!", 400));
      }

      const question = courseContent?.questions.find((item) =>
        item.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id!", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add this answer to our question
      question?.questionReplies.push(newAnswer);

      // save the updated course
      await course?.save();

      if (req.user?._id == question.user._id) {
        // create a notification
        await Notification.create({
          user: question.user._id,
          title: "New Answer Received",
          message: `You have a new answer in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // check if courseId already exits in userCourseList base of _id
      const courseExists = userCourseList?.find(
        (item: any) => item._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course!", 400)
        );
      }

      const course = await Course.findById(courseId);
      const { review, rating } = req.body as IAddReviewData;

      // create a new review object
      const newReview: any = {
        user: req.user,
        comment: review,
        rating,
      };

      // add this review to our course
      course?.reviews.push(newReview);

      let totalRating = 0;
      course?.reviews.forEach((item) => {
        totalRating += item.rating;
      });

      if (course) {
        course.ratings = totalRating / course.reviews.length;
      }

      // save the updated course
      await course?.save();

      const notification = {
        title: "New Reviews Received",
        message: `${req.user?.name} has given a review on ${course?.name}`,
      };

      // create notification

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add reply in review
interface IAddReplyData {
  comment: string;
  reviewId: string;
  courseId: string;
}

export const addReplyReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, reviewId, courseId } = req.body as IAddReplyData;

      const course = await Course.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found!", 400));
      }

      const review = course.reviews.find((item) => item.equals(reviewId));

      if (!review) {
        return next(new ErrorHandler("Review not found!", 400));
      }

      const newReply: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies.push(newReply);

      await course.save();

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all courses for admin
export const getCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete course for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return next(new ErrorHandler("Course not found!", 400));
      }

      await Course.findByIdAndDelete(course._id);
      await redis.del(course._id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        {
          ttl: 300,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VIDEOCIPHER_API_SECRET}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
