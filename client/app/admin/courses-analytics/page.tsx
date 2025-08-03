"use client";

import CourseAnalytics from "../../components/admin/Analytics/CourseAnalytics";
import AdminLayout from "../../components/admin/AdminLayout";
import Heading from "../../utils/Heading";
import AdminProtected from "../../hooks/adminProtected";
import React from "react";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="Courses Analytics - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            
            <AdminLayout>
                <CourseAnalytics />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;