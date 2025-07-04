"use client";

import DashBoardHero from "@/app/components/admin/DashBoardHero";
import AllUsers from "../../components/admin/Users/AllUsers";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import React from "react";

const Page = () => {
    return (
        <div>
            <Heading
                title="Team - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            <div className="flex h-full">
                {" "}
                <div className="1500px:w-[19%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashBoardHero />
                    <AllUsers isTeam={true} />

                </div>
            </div>
        </div>
    );
};

export default Page;