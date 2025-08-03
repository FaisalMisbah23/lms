"use client";
import React from "react";
import AdminProtected from "../hooks/adminProtected";
import Heading from "../utils/Heading";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardWidgets from "../components/admin/Widgets/DashboardWidgets";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="Dashboard - Admin | Elearning"
                description="Admin dashboard for managing courses, users, and analytics"
                keywords="Admin, Dashboard, Analytics, Management"
            />
            
            <AdminLayout>
                <DashboardWidgets />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;