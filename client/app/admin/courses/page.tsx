"use client";
import DashBoardHero from "@/app/components/admin/DashBoardHero";
import AllCourses from "../../components/admin/course/AllCourses";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import React from "react";

const Page = () => {
    return (
        <div>
            <Heading
                title={`Create-Course-Admin`}
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming , MERN ,REDUX , Machine Learning"
            />
            <div className="flex h-full">
                {" "}
                <div className="1500px:w-[19%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashBoardHero />
                    <AllCourses />

                </div>
            </div>
        </div>
    );
};

export default Page;