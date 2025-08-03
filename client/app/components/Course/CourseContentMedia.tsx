import { styles } from "@/app/style/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
    useAddAnswerInQuestionMutation,
    useAddNewQuestionMutation,
    useAddReplyInReviewMutation, 
    useAddReviewInCourseMutation
} from "../../../redux/features/courses/coursesApi";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format } from "timeago.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    AiFillStar,
    AiOutlineArrowLeft,
    AiOutlineArrowRight,
    AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client"
import { FiChevronLeft, FiChevronRight, FiFileText, FiLink, FiMessageCircle, FiStar, FiSend } from "react-icons/fi";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    user: any;
    refetch: any;
};

const CourseContentMedia = ({
    data,
    id,
    activeVideo,
    setActiveVideo,
    user,
    refetch,
}: Props) => {
    const [activeBar, setActiveBar] = useState(0);
    const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
        id,
        { refetchOnMountOrArgChange: true }
    );
    const [
        addNewQuestion,
        { isSuccess, error, isLoading: questionCreationLoading },
    ] = useAddNewQuestionMutation();
    const [
        addAnswerInQuestion,
        {
            isSuccess: answerSuccess,
            error: answerError,
            isLoading: answerCreationLoading,
        },
    ] = useAddAnswerInQuestionMutation();
    const [
        addReviewInCourse,
        {
            isSuccess: reviewSuccess,
            error: reviewError,
            isLoading: reviewCreationLoading,
        },
    ] = useAddReviewInCourseMutation();

    const [
        addReplyInReview,
        {
            isSuccess: replySuccess,
            error: replyError,
            isLoading: replyCreationLoading,
        },
    ] = useAddReplyInReviewMutation();

    const course = courseData?.course;
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [question, setQuestion] = useState("");
    const [reply, setReply] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [isReviewReply, setIsReviewReply] = useState(false);

    const isReviewExists = course?.reviews?.find(
        (item: any) => item.user._id === user._id
    );

    const handleQuestion = async () => {
        if (question.length === 0) {
            toast.error("Question can't be empty");
        } else {
            addNewQuestion({
                question,
                courseId: id,
                contentId: data[activeVideo]._id,
            });
        }
    };

    const handleAnswerSubmit = async () => {
        addAnswerInQuestion({
            answer,
            courseId: id,
            contentId: data[activeVideo]._id,
            questionId: questionId,
        });
    };

    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            socketId.emit("notification", {
                title: `New Question Received`,
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
            });
        }
        if (answerSuccess) {
            setAnswer("");
            refetch();
            if (user.role !== "admin") {
                socketId.emit("notification", {
                    title: `New Reply Received`,
                    message: `You have a new question in ${data[activeVideo].title}`,
                    userId: user._id,
                });
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (answerError) {
            if ("data" in answerError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            socketId.emit("notification", {
                title: `New Question Received`,
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
            });
        }
        if (reviewError) {
            if ("data" in reviewError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (replySuccess) {
            setReply("");
            courseRefetch();
        }
        if (replyError) {
            if ("data" in replyError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, answerSuccess, answerError, reviewSuccess, reviewError, replySuccess, replyError, refetch, data, activeVideo, user._id, user.role, courseRefetch]);

    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            toast.error("Review can't be empty");
        } else {
            addReviewInCourse({ review, rating, courseId: id });
        }
    };

    const handleReviewReplySubmit = () => {
        if (!replyCreationLoading) {
            if (reply === "") {
                toast.error("Reply can't be empty");
            } else {
                addReplyInReview({ comment: reply, courseId: id, reviewId });
            }
        }
    };

    const tabItems = [
        { id: 0, label: "Overview", icon: FiFileText },
        { id: 1, label: "Resources", icon: FiLink },
        { id: 2, label: "Q&A", icon: FiMessageCircle },
        { id: 3, label: "Reviews", icon: FiStar },
    ];

    return (
        <div className="space-y-6">
            {/* Video Player */}
            <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
                <CoursePlayer
                    title={data[activeVideo]?.title}
                    videoUrl={data[activeVideo]?.videoUrl}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        activeVideo === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    onClick={() => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)}
                    disabled={activeVideo === 0}
                >
                    <FiChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>
                
                <div className="text-sm text-muted-foreground">
                    Lesson {activeVideo + 1} of {data.length}
                </div>

                <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        data.length - 1 === activeVideo
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    onClick={() =>
                        setActiveVideo(
                            data && data.length - 1 === activeVideo
                                ? activeVideo
                                : activeVideo + 1
                        )
                    }
                    disabled={data.length - 1 === activeVideo}
                >
                    <span>Next</span>
                    <FiChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Lesson Title */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    {data[activeVideo].title}
                </h1>
                <p className="text-muted-foreground">
                    Lesson {activeVideo + 1} • {data[activeVideo].videoLength} minutes
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-card rounded-xl border border-border shadow-soft">
                <div className="flex border-b border-border">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                                    activeBar === tab.id
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => setActiveBar(tab.id)}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeBar === 0 && (
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-foreground leading-relaxed whitespace-pre-line">
                                {data[activeVideo]?.description}
                            </p>
                        </div>
                    )}

                    {activeBar === 1 && (
                        <div className="space-y-4">
                            {data[activeVideo]?.links?.map((item: any, index: number) => (
                                <div key={index} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                    <FiLink className="w-5 h-5 text-primary flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        {item.title && (
                                            <h3 className="font-medium text-foreground mb-1">
                                                {item.title}
                                            </h3>
                                        )}
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 transition-colors break-all"
                                        >
                                            {item.url}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeBar === 2 && (
                        <div className="space-y-6">
                            {/* Ask Question */}
                            <div className="bg-muted/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Ask a Question
                                </h3>
                                <div className="flex space-x-4">
                                    <Image
                                        src={
                                            user.avatar
                                                ? user.avatar.url
                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                        }
                                        width={40}
                                        height={40}
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="What would you like to ask about this lesson?"
                                            className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                                            rows={3}
                                        />
                                        <div className="flex justify-end mt-3">
                                            <button
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                    questionCreationLoading
                                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                                }`}
                                                onClick={questionCreationLoading ? () => {} : handleQuestion}
                                                disabled={questionCreationLoading}
                                            >
                                                <FiSend className="w-4 h-4" />
                                                <span>Ask Question</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Questions & Answers
                                </h3>
                                <CommentReply
                                    data={data}
                                    activeVideo={activeVideo}
                                    answer={answer}
                                    setAnswer={setAnswer}
                                    handleAnswerSubmit={handleAnswerSubmit}
                                    user={user}
                                    questionId={questionId}
                                    setQuestionId={setQuestionId}
                                    answerCreationLoading={answerCreationLoading}
                                />
                            </div>
                        </div>
                    )}

                    {activeBar === 3 && (
                        <div className="space-y-6">
                            {/* Add Review */}
                            {!isReviewExists && (
                                <div className="bg-muted/30 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Write a Review
                                    </h3>
                                    <div className="flex space-x-4">
                                        <Image
                                            src={
                                                user.avatar
                                                    ? user.avatar.url
                                                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                            }
                                            width={40}
                                            height={40}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Rating <span className="text-destructive">*</span>
                                                </label>
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setRating(i)}
                                                            className="p-1 hover:scale-110 transition-transform"
                                                        >
                                                            {rating >= i ? (
                                                                <AiFillStar className="w-6 h-6 text-yellow-400" />
                                                            ) : (
                                                                <AiOutlineStar className="w-6 h-6 text-yellow-400" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                placeholder="Share your thoughts about this course..."
                                                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                                                rows={3}
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                        reviewCreationLoading
                                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    }`}
                                                    onClick={reviewCreationLoading ? () => {} : handleReviewSubmit}
                                                    disabled={reviewCreationLoading}
                                                >
                                                    <FiSend className="w-4 h-4" />
                                                    <span>Submit Review</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Course Reviews
                                </h3>
                                <div className="space-y-4">
                                    {(course?.reviews && [...course.reviews].reverse())?.map(
                                        (item: any, index: number) => (
                                            <div key={index} className="bg-muted/30 rounded-lg p-4">
                                                <div className="flex space-x-3">
                                                    <Image
                                                        src={
                                                            item.user.avatar
                                                                ? item.user.avatar.url
                                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                        }
                                                        width={40}
                                                        height={40}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h4 className="font-medium text-foreground">
                                                                {item?.user.name}
                                                            </h4>
                                                            <Ratings rating={item.rating} />
                                                        </div>
                                                        <p className="text-foreground mb-2">{item.comment}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(item.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Admin Reply */}
                                                {user.role === "admin" && item.commentReplies.length === 0 && (
                                                    <button
                                                        className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
                                                        onClick={() => {
                                                            setIsReviewReply(true);
                                                            setReviewId(item._id);
                                                        }}
                                                    >
                                                        Add Reply
                                                    </button>
                                                )}

                                                {isReviewReply && reviewId === item._id && (
                                                    <div className="mt-4 flex space-x-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your reply..."
                                                            value={reply}
                                                            onChange={(e: any) => setReply(e.target.value)}
                                                            className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                        />
                                                        <button
                                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                                            onClick={handleReviewReplySubmit}
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Review Replies */}
                                                {item.commentReplies.map((i: any, index: number) => (
                                                    <div key={index} className="mt-4 ml-12 flex space-x-3">
                                                        <Image
                                                            src={
                                                                i.user.avatar
                                                                    ? i.user.avatar.url
                                                                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                            }
                                                            width={32}
                                                            height={32}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <h5 className="font-medium text-foreground">
                                                                    {i.user.name}
                                                                </h5>
                                                                <VscVerifiedFilled className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <p className="text-foreground text-sm">{i.comment}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(i.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommentReply = ({
    data,
    activeVideo,
    answer,
    setAnswer,
    handleAnswerSubmit,
    questionId,
    setQuestionId,
    answerCreationLoading,
}: any) => {
    return (
        <div className="space-y-4">
            {data[activeVideo].questions.map((item: any, index: any) => (
                <CommentItem
                    key={index}
                    data={data}
                    activeVideo={activeVideo}
                    item={item}
                    index={index}
                    answer={answer}
                    setAnswer={setAnswer}
                    questionId={questionId}
                    setQuestionId={setQuestionId}
                    handleAnswerSubmit={handleAnswerSubmit}
                    answerCreationLoading={answerCreationLoading}
                />
            ))}
        </div>
    );
};

const CommentItem = ({
    questionId,
    setQuestionId,
    item,
    answer,
    setAnswer,
    handleAnswerSubmit,
    answerCreationLoading,
}: any) => {
    const [replyActive, setReplyActive] = useState(false);
    
    return (
        <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex space-x-3 mb-3">
                <Image
                    src={
                        item.user.avatar
                            ? item.user.avatar.url
                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={40}
                    height={40}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{item?.user.name}</h4>
                    <p className="text-foreground mb-2">{item?.question}</p>
                    <p className="text-sm text-muted-foreground">
                        {!item.createdAt ? "" : format(item?.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
                <button
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={() => {
                        setReplyActive(!replyActive);
                        setQuestionId(item._id);
                    }}
                >
                    {!replyActive
                        ? item.questionReplies.length !== 0
                            ? "All Replies"
                            : "Add Reply"
                        : "Hide Replies"}
                </button>
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <BiMessage className="w-4 h-4" />
                    <span>{item.questionReplies.length}</span>
                </div>
            </div>

            {replyActive && questionId === item._id && (
                <div className="mt-4 space-y-4">
                    {item.questionReplies.map((reply: any) => (
                        <div key={reply._id} className="ml-12 flex space-x-3">
                            <Image
                                src={
                                    reply.user.avatar
                                        ? reply.user.avatar.url
                                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                }
                                width={32}
                                height={32}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-foreground">{reply.user.name}</h5>
                                    {reply.user.role === "admin" && (
                                        <VscVerifiedFilled className="w-4 h-4 text-primary" />
                                    )}
                                </div>
                                <p className="text-foreground text-sm">{reply.answer}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(reply.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    <div className="ml-12 flex space-x-3">
                        <input
                            type="text"
                            placeholder="Enter your answer..."
                            value={answer}
                            onChange={(e: any) => setAnswer(e.target.value)}
                            className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAnswerSubmit}
                            disabled={answer === "" || answerCreationLoading}
                        >
                            Reply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseContentMedia;