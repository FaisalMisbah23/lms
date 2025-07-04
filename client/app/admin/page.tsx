"use client";
import React from "react";
import AdminProtected from "../hooks/adminProtected";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/admin/sidebar/AdminSidebar";
import DashBoardHero from "../components/admin/DashBoardHero";

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Dashboard - Admin | Elearning"
                    description="Elearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <div className="flex h-full">
                    {" "}
                    <div className="1500px:w-[19%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div></div>
                    <div className="w-[85%] min-h-screen">
                        <DashBoardHero isDashboard={true} />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;