"use client";

import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import DashBoardHero from "../../components/admin/DashBoardHero";
import EditHero from "../../components/Customization/EditHero";


const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Hero - Admin | Elearning"
                    description="Elearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <div className="flex h-screen">
                    <div className="1500px:w-[15%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashBoardHero />
                        <EditHero />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;