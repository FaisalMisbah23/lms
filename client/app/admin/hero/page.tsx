"use client";

import AdminLayout from "../../components/admin/AdminLayout";
import Heading from "../../utils/Heading";
import AdminProtected from "../../hooks/adminProtected";
import React from "react";
import EditHero from "@/app/components/Customization/EditHero";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="Hero - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            
            <AdminLayout>
                <EditHero />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;