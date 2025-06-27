"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getCourses = exports.addReplyReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const redis_1 = require("../utils/redis");
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// create course
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.url,
            };
        }
        let courses = yield course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        yield redis_1.redis.set("allCourses", JSON.stringify(courses));
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// edit course
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const courseId = req.params.id;
        // Find the course first
        const existingCourse = yield course_model_1.default.findById(courseId);
        if (!existingCourse) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Handle Thumbnail Update
        if (data.thumbnail) {
            if (data.thumbnail.url && data.thumbnail.url.startsWith("data:")) {
                // Delete old thumbnail if it exists
                const thumb = existingCourse.thumbnail;
                if (thumb && thumb.public_id) {
                    yield cloudinary_1.default.v2.uploader.destroy(thumb.public_id);
                }
                // 🔹 Upload new thumbnail
                const uploadedImage = yield cloudinary_1.default.v2.uploader.upload(data.thumbnail.url, { folder: "courses" });
                // 🔹 Update thumbnail data
                data.thumbnail = {
                    public_id: uploadedImage.public_id,
                    url: uploadedImage.secure_url,
                };
            }
            else {
                console.log("Using existing thumbnail data:", data.thumbnail);
            }
        }
        // Update Course Data
        const updatedCourse = yield course_model_1.default.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        //  Return Response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error updating course:", error.message);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get single course without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const isCached = yield redis_1.redis.get(courseId);
        let course;
        if (isCached !== null) {
            course = JSON.parse(isCached);
        }
        else {
            const course = yield course_model_1.default.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            if (!course) {
                return next(new ErrorHandler_1.default("Course not found", 404));
            }
            yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 7 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// get all courses without purchasing
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCached = yield redis_1.redis.get("allCourses");
        let courses;
        if (isCached) {
            courses = JSON.parse(isCached);
        }
        else {
            courses = yield course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            yield redis_1.redis.set("allCourses", JSON.stringify(courses));
        }
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// get course content for valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
        const courseId = req.params.id;
        // get course content for valid user
        const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find((item) => { var _a, _b; return (item.courseId || ((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a))) === courseId; });
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course!", 404));
        }
        const course = yield course_model_1.default.findById(courseId);
        const content = course === null || course === void 0 ? void 0 : course.courseData;
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { question, courseId, contentId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id!", 400));
        }
        const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => { var _a, _b; return (((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || item.id) === contentId; });
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id!", 400));
        }
        // create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        // add this question to our course content
        courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions.push(newQuestion);
        yield notification_model_1.default.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent.title}`,
        });
        // save the updated course
        yield (course === null || course === void 0 ? void 0 : course.save());
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.addAnswer = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { answer, questionId, contentId, courseId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id!", 400));
        }
        const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => { var _a, _b; return (((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || item.id) === contentId; });
        const question = courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions.find((item) => { var _a, _b; return (((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || item.id) === questionId; });
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id!", 400));
        }
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id!", 400));
        }
        // create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        // add this answer to our question
        if (!question.questionReplies)
            question.questionReplies = [];
        question.questionReplies.push(newAnswer);
        // save the updated course
        yield (course === null || course === void 0 ? void 0 : course.save());
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) == question.user._id) {
            // create a notification
            yield notification_model_1.default.create({
                user: question.user._id,
                title: "New Answer Received",
                message: `You have a new answer in ${courseContent.title}`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                yield (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 400));
            }
        }
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.addReview = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
        const courseId = req.params.id;
        // check if courseId already exits in userCourseList base of _id
        const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find((item) => { var _a, _b; return (item.courseId || ((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a))) === courseId; });
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course!", 400));
        }
        const course = yield course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        // create a new review object
        const newReview = {
            user: req.user,
            comment: review,
            rating,
        };
        // add this review to our course
        course === null || course === void 0 ? void 0 : course.reviews.push(newReview);
        let totalRating = 0;
        course === null || course === void 0 ? void 0 : course.reviews.forEach((item) => {
            totalRating += item.rating;
        });
        if (course) {
            course.ratings = totalRating / course.reviews.length;
        }
        // save the updated course
        yield (course === null || course === void 0 ? void 0 : course.save());
        if (course && (course._id || course.id)) {
            yield redis_1.redis.set(((_c = (_b = course._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || course.id, JSON.stringify(course), "EX", 7 * 24 * 60 * 60);
        }
        const notification = {
            title: "New Reviews Received",
            message: `${(_d = req.user) === null || _d === void 0 ? void 0 : _d.name} has given a review on ${course === null || course === void 0 ? void 0 : course.name}`,
        };
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.addReplyReview = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { comment, reviewId, courseId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found!", 400));
        }
        const review = course.reviews.find((item) => { var _a, _b; return (((_b = (_a = item._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || item.id) === reviewId; });
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found!", 400));
        }
        const newReply = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies.push(newReply);
        yield course.save();
        yield redis_1.redis.set(((_b = (_a = course._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || course.id, JSON.stringify(course), "EX", 7 * 24 * 60 * 60);
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// get all courses for admin
exports.getCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// delete course for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const course = yield course_model_1.default.findById(req.params.id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found!", 400));
        }
        yield course_model_1.default.findByIdAndDelete(course._id);
        yield redis_1.redis.del(((_b = (_a = course._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || course.id);
        const courses = yield course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        yield redis_1.redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// generate video url
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.body;
        const response = yield axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
            ttl: 300,
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VIDEOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
