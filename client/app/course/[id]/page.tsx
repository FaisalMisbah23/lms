"use client";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";
import React from "react";
import { useParams } from "next/navigation";
import Heading from "@/app/utils/Heading";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div>
            <Heading
                title="Course Details | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            <CourseDetailsPage id={id} />
        </div>
    );
};

export default Page;