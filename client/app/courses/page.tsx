"use client"

import { Suspense } from "react";
import Loader from "../components/Loader/Loader"

export default function PageWrapper() {
    return (
        <Suspense fallback={<div><Loader /> </div>}>
            <Page />
        </Suspense>
    );
}

import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";
import { FiBookOpen, FiUsers, FiStar, FiTrendingUp } from "react-icons/fi";

export const dynamic = "force-dynamic";

// Static course data for when database is not connected
const staticCourses = [
    {
        _id: "1",
        name: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node.js and more!",
        price: 29.99,
        estimatedPrice: 99.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop"
        },
        tags: "Web Development",
        level: "Beginner",
        demoUrl: "https://demo.com",
        totalVideos: 80,
        ratings: 4.5,
        purchased: 1200,
        category: "Web Development"
    },
    {
        _id: "2",
        name: "Python for Data Science",
        description: "Master Python programming for data analysis and machine learning",
        price: 39.99,
        estimatedPrice: 129.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop"
        },
        tags: "Python, Data Science",
        level: "Intermediate",
        demoUrl: "https://demo.com",
        totalVideos: 65,
        ratings: 4.8,
        purchased: 850,
        category: "Data Science"
    },
    {
        _id: "3",
        name: "React Native Mobile Development",
        description: "Build cross-platform mobile apps with React Native",
        price: 49.99,
        estimatedPrice: 149.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop"
        },
        tags: "React Native, Mobile",
        level: "Advanced",
        demoUrl: "https://demo.com",
        totalVideos: 95,
        ratings: 4.7,
        purchased: 650,
        category: "Mobile Development"
    },
    {
        _id: "4",
        name: "Machine Learning Fundamentals",
        description: "Learn the basics of machine learning and AI",
        price: 59.99,
        estimatedPrice: 179.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1677442136019-21780ecadf2b?w=500&h=300&fit=crop"
        },
        tags: "Machine Learning, AI",
        level: "Advanced",
        demoUrl: "https://demo.com",
        totalVideos: 120,
        ratings: 4.9,
        purchased: 450,
        category: "Machine Learning"
    },
    {
        _id: "5",
        name: "UI/UX Design Masterclass",
        description: "Create beautiful and functional user interfaces",
        price: 34.99,
        estimatedPrice: 109.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
        },
        tags: "UI/UX, Design",
        level: "Beginner",
        demoUrl: "https://demo.com",
        totalVideos: 55,
        ratings: 4.6,
        purchased: 920,
        category: "Design"
    },
    {
        _id: "6",
        name: "DevOps and CI/CD Pipeline",
        description: "Master DevOps practices and continuous integration",
        price: 44.99,
        estimatedPrice: 139.99,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1667372393119-2d4c7636c7e6?w=500&h=300&fit=crop"
        },
        tags: "DevOps, CI/CD",
        level: "Intermediate",
        demoUrl: "https://demo.com",
        totalVideos: 75,
        ratings: 4.4,
        purchased: 380,
        category: "DevOps"
    }
];

const staticCategories = [
    { title: "Web Development" },
    { title: "Data Science" },
    { title: "Mobile Development" },
    { title: "Machine Learning" },
    { title: "Design" },
    { title: "DevOps" }
];

const Page = () => {
    const searchParams = useSearchParams();
    const search = searchParams?.get("title");
    const { data, isLoading, error } = useGetUserAllCoursesQuery({});
    const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [category, setCategory] = useState("All");

    // Use dynamic data from API, fallback to static data if API fails or no data
    const allCourses = data?.courses && data.courses.length > 0 ? data.courses : staticCourses;
    const categories = categoriesData?.layout?.categories && categoriesData.layout.categories.length > 0 
        ? categoriesData.layout.categories 
        : staticCategories;

    useEffect(() => {
        if (category === "All") {
            setCourses(allCourses);
        } else {
            setCourses(
                allCourses.filter((item: any) => item.category === category)
            );
        }
        if (search) {
            setCourses(
                allCourses.filter((item: any) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [allCourses, category, search]);

    const stats = [
        { icon: FiBookOpen, value: "1000+", label: "Courses Available" },
        { icon: FiUsers, value: "500K+", label: "Active Students" },
        { icon: FiStar, value: "4.9", label: "Average Rating" },
        { icon: FiTrendingUp, value: "95%", label: "Success Rate" },
    ];

    return (
        <div>
                    <Header
                        route={route}
                        setRoute={setRoute}
                        open={open}
                        setOpen={setOpen}
                        activeItem={1}
                    />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <Heading
                            title="All Courses | Elearning"
                            description="Elearning is a platform for students to learn and get help from teachers"
                            keywords="Programming, MERN, Redux, Machine Learning"
                        />
                    
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                            <FiBookOpen className="w-4 h-4" />
                            <span>Explore Our Courses</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Expand Your Career{" "}
                            <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                                Opportunity
                            </span>{" "}
                            With Our Courses
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                category === "All" 
                                    ? "bg-primary text-primary-foreground shadow-lg" 
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setCategory("All")}
                        >
                            All
                        </button>
                        {categories.map((item: any, index: number) => (
                            <button
                                key={index}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                    category === item.title 
                                        ? "bg-primary text-primary-foreground shadow-lg" 
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                                            onClick={() => setCategory(item.title)}
                                        >
                                            {item.title}
                            </button>
                        ))}
                                        </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Loading Courses...
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Please wait while we fetch the latest courses
                            </p>
                        </div>
                    )}

                    {/* No Courses Message */}
                    {!isLoading && courses && courses.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                <FiBookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {search ? "No courses found!" : "No courses found in this category"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {search ? "Try a different search term" : "Please try another category"}
                            </p>
                        </div>
                    )}

                    {/* Courses Grid */}
                    {!isLoading && courses && courses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((item: any, index: number) => (
                                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CourseCard item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                        </div>
                    </div>
                    <Footer />
        </div>
    );
};