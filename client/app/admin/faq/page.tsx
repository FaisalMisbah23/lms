"use client";

import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import EditFaq from "../../components/Customization/EditFaq";
import DashBoardHero from "@/app/components/admin/DashBoardHero";


const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="FAQ - Admin | Elearning"
                    description="Elearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashBoardHero />
                        <EditFaq />
                        <br />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;