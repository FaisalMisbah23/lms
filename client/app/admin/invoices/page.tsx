'use client'
import React from 'react'
import Heading from '../../utils/Heading';
import AdminSidebar from '@/app/components/admin/sidebar/AdminSidebar';
import DashboardHeader from '@/app/components/admin/DashBoardHeader';
import AllInvoices from '@/app/components/admin/Orders/AllInvoices';

const page = () => {
    return (
        <div>
            <Heading
                title="Elearning - Admin"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <div className="flex">
                <div className="1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHeader />
                    <AllInvoices />
                </div>
            </div>
        </div>
    )
}

export default page