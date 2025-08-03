"use client";

import AllInvoices from "../../components/admin/Orders/AllInvoices";
import AdminLayout from "../../components/admin/AdminLayout";
import Heading from "../../utils/Heading";
import AdminProtected from "../../hooks/adminProtected";
import React from "react";

const Page = () => {
    return (
        <AdminProtected>
            <Heading
                title="Invoices - Admin | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            
            <AdminLayout>
                <AllInvoices />
            </AdminLayout>
        </AdminProtected>
    );
};

export default Page;