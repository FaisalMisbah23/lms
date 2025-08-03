
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "../Course/CourseCard";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";

import { FiBookOpen, FiUsers, FiStar, FiTrendingUp } from "react-icons/fi";

const Courses = () => {
    const router = useRouter();
    const { data, refetch, isLoading } = useGetUserAllCoursesQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        setCourses(data?.courses);
        refetch();
    }, [data, refetch]);

    const handleBrowseCourses = () => {
        router.push("/courses");
    };

    const stats = [
        { icon: FiBookOpen, value: "1000+", label: "Courses Available" },
        { icon: FiUsers, value: "500K+", label: "Active Students" },
        { icon: FiStar, value: "4.9", label: "Average Rating" },
        { icon: FiTrendingUp, value: "95%", label: "Success Rate" },
    ];

    return (
        <section className="py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container-responsive">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                        <FiBookOpen className="w-4 h-4" />
                        <span>Explore Our Courses</span>
                    </div>
                    
                    <h2 className="heading-responsive font-bold text-balance mb-6 text-gray-900 dark:text-white">
                        Expand Your Career{" "}
                        <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                            Opportunity
                        </span>{" "}
                    With Our Courses
                    </h2>
                    
                    <p className="text-responsive text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover a world of knowledge with our comprehensive course library. 
                        From beginner to advanced, we have courses for every skill level and interest.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover-lift"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Courses Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses &&
                            courses.map((item: any, index: number) => (
                                <div 
                                    key={index}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CourseCard item={item} />
                                </div>
                            ))}
                    </div>
                )}

                {/* CTA Section */}
                {courses && courses.length > 0 && (
                    <div className="text-center mt-12 animate-fade-in">
                        <div className="bg-gradient-to-r from-primary/10 to-brand-600/10 rounded-2xl p-8 border border-primary/20 bg-white dark:bg-gray-800">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                Ready to Start Learning?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                                Join thousands of students who have already transformed their careers with our courses.
                            </p>
                            <button 
                                onClick={handleBrowseCourses}
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                            >
                                <span>Browse All Courses</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Courses;