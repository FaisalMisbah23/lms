import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { FiBookOpen, FiUsers, FiClock, FiStar, FiPlay } from "react-icons/fi";

type Props = {
    item: any;
    isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
    const formatPrice = (price: number) => {
        return price === 0 ? "Free" : `$${price}`;
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <Link
            href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
            className="group block"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover-lift overflow-hidden transition-all duration-300 group-hover:shadow-medium">
                {/* Course Image */}
                <div className="relative overflow-hidden">
                <Image
                    src={item.thumbnail.url}
                        width={400}
                        height={250}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Button */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow hover:shadow-glow/50 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                        <FiPlay className="w-5 h-5 text-white ml-0.5" />
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                            {formatPrice(item.price)}
                        </div>
                    </div>

                    {/* Discount Badge */}
                    {item.estimatedPrice > item.price && (
                        <div className="absolute top-4 left-4">
                            <div className="bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs font-medium">
                                {Math.round(((item.estimatedPrice - item.price) / item.estimatedPrice) * 100)}% OFF
                            </div>
                        </div>
                    )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                    {/* Course Title */}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {item.name}
                        </h3>

                    {/* Instructor */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        by {item.instructor?.name || "Instructor"}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                                <FiBookOpen className="w-4 h-4" />
                                <span>{item.courseData?.length || 0} lessons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FiClock className="w-4 h-4" />
                                <span>{formatDuration(item.courseData?.reduce((acc: number, curr: any) => acc + (curr.videoLength || 0), 0) || 0)}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FiUsers className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item.purchased || 0}</span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.ratings || 0}</span>
                            </div>
                            <Ratings rating={item.ratings} />
                        </div>
                        {isProfile && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {item.purchased} Students
                            </div>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(item.price)}
                            </span>
                            {item.estimatedPrice > item.price && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                    ${item.estimatedPrice}
                                </span>
                            )}
                        </div>
                        
                        {/* Category Badge */}
                        {item.category && (
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                {item.category}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;