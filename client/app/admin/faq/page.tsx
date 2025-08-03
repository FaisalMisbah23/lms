"use client";

import AdminLayout from "../../components/admin/AdminLayout";
import Heading from "../../utils/Heading";
import AdminProtected from "../../hooks/adminProtected";
import React from "react";
import EditFaq from "@/app/components/Customization/EditFaq";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="FAQ - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            
            <AdminLayout>
                <EditFaq />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;