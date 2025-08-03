"use client";

import AdminLayout from "../../components/admin/AdminLayout";
import Heading from "../../utils/Heading";
import AdminProtected from "../../hooks/adminProtected";
import React from "react";
import AllUsers from "@/app/components/admin/Users/AllUsers";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="Manage Team - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            
            <AdminLayout>
                <AllUsers />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;