"use client";
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import Heading from "../../utils/Heading";
import CourseAnalytics from "../../components/admin/Analytics/CourseAnalytics";
import DashBoardHero from "@/app/components/admin/DashBoardHero";

const page = () => {
    return (
        <div>
            <Heading
                title="Elearning - Admin"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <div className="flex">
                <div className="1500px:w-[19%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashBoardHero />
                    <CourseAnalytics />
                </div>
            </div>
        </div>
    );
};

export default page;