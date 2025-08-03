
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { VscVerifiedFilled } from "react-icons/vsc";
import CourseContentList from "./CourseContentList";
import CheckOutForm from "../Payment/CheckOutForm";
import { FiPlay, FiClock, FiUsers, FiStar, FiCheckCircle, FiBookOpen, FiAward, FiShield } from "react-icons/fi";

type Props = {
    data: any;
    clientSecret: string;
    stripePromise: any;
    setRoute: any;
    setOpen: any;
};

const CourseDetails = ({
    data,
    stripePromise,
    clientSecret,
    setRoute,
    setOpen: openAuthModal,
}: Props) => {
    const { data: userData, refetch } = useLoadUserQuery(undefined, {});
    const [user, setUser] = useState<any>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setUser(userData?.user);
    }, [userData]);

    const discountPercentage =
        ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

    const discountPercentagePrice = discountPercentage.toFixed(0);

    const isPurchased =
        user && user?.courses?.find((item: any) => item.courseId === data._id);

    const handleOrder = (e: any) => {
        if (user) {
            setOpen(true);
        } else {
            setRoute("Login");
            openAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Course Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            <FiBookOpen className="w-4 h-4" />
                            <span>{data.category}</span>
                        </div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                            <FiAward className="w-4 h-4" />
                            <span>{data.level}</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {data.name}
                        </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-4xl">
                        {data.description}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                <FiStar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {typeof data?.ratings === "number" ? data.ratings.toFixed(1) : "0.0"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Rating</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                <FiUsers className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.purchased}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Students</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                <FiPlay className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.totalVideos}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Lessons</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                <FiClock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.reviews?.length || 0}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            What you will learn from this course?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.benefits?.map((item: any, index: number) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                        <IoCheckmarkDoneOutline
                                            size={20}
                                                className="text-green-500"
                                        />
                                    </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            What are the prerequisites for starting this course?
                            </h2>
                            <div className="space-y-4">
                        {data.prerequisites?.map((item: any, index: number) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                    <IoCheckmarkDoneOutline
                                        size={20}
                                                className="text-green-500"
                                    />
                                </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Overview */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Course Overview
                            </h2>
                            <CourseContentList isDemo={true} data={data?.courseData} />
                        </div>

                        {/* Course Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Course Details
                            </h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {data.description}
                            </p>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                <Ratings rating={data?.ratings} />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {typeof data?.ratings === "number" ? data.ratings.toFixed(1) : "0.0"} Course Rating
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {data?.reviews?.length || 0} Reviews
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                            {(data?.reviews && [...data.reviews].reverse()).map(
                                (item: any, index: number) => (
                                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.user.avatar
                                                            ? item.user.avatar.url
                                                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                    }
                                                        width={48}
                                                        height={48}
                                                    alt=""
                                                        className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                                        {item.user.name}
                                                    </h5>
                                                    <Ratings rating={item.rating} />
                                                </div>
                                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                    {item.comment}
                                                </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {format(item.createdAt)}
                                                    </p>
                                            </div>
                                            </div>

                                            {/* Review Replies */}
                                            {item.commentReplies.map((i: any, replyIndex: number) => (
                                                <div key={replyIndex} className="ml-16 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                    <Image
                                                        src={
                                                            i.user.avatar
                                                                ? i.user.avatar.url
                                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                        }
                                                                width={40}
                                                                height={40}
                                                        alt=""
                                                                className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                                                    {i.user.name}
                                                                </h5>
                                                                <VscVerifiedFilled className="text-blue-500 w-5 h-5" />
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                                {i.question}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {format(i.createdAt)}
                                                            </p>
                                                        </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Video Player */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {data.price === 0 ? "Free" : `$${data.price}`}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                            ${data.estimatedPrice}
                                        </span>
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                                            {discountPercentagePrice}% Off
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mb-6">
                                {isPurchased ? (
                                    <Link
                                            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                                        href={`/course-access/${data._id}`}
                                    >
                                            <FiPlay className="w-5 h-5" />
                                            <span>Enter to Course</span>
                                    </Link>
                                ) : (
                                        <button
                                            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                                        onClick={handleOrder}
                                    >
                                            <FiCheckCircle className="w-5 h-5" />
                                            <span>Buy Now ${data.price}</span>
                                        </button>
                                    )}
                                </div>

                                {/* Course Features */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Source code included</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Full lifetime access</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Premium Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
                {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Complete Purchase
                            </h3>
                            <button
                                    onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <IoCloseOutline size={24} />
                            </button>
                            </div>
                        <div className="p-6">
                                {stripePromise && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <CheckOutForm
                                            setOpen={setOpen}
                                            data={data}
                                            user={user}
                                            refetch={refetch}
                                        />
                                    </Elements>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default CourseDetails;