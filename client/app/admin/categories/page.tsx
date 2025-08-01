"use client";

import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import EditCategories from "../../components/Customization/EditCategories";
import DashBoardHero from "@/app/components/admin/DashBoardHero";

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Elearning - Admin"
                    description="ELearning is a platform for students to learn and get help from teachers"
                    keywords="Programming,MERN,Redux,Machine Learning"
                />
                <div className="flex h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashBoardHero />
                        <EditCategories />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;