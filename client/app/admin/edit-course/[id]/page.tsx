"use client";
import React from "react";
import { useParams } from "next/navigation";
import DashBoardHero from "@/app/components/admin/DashBoardHero";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import EditCourse from "../../../components/admin/course/EditCourse";

interface Params {
    id: string;
}

const Page = ({ params }: any) => {
    const id = params.id;

    return (

        <div>
            <Heading
                title="Edit-Course-Admin"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, REDUX, Machine Learning"
            />
            <div className="flex h-full">
                <div className="1500px:w-[19%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashBoardHero />
                    <EditCourse id={id} />
                </div>
            </div>
        </div>
    );
};

export default Page;