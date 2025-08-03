"use client";
import React, { useState } from "react";
import AdminSidebar from "./sidebar/AdminSidebar";
import DashBoardHeader from "./DashBoardHeader";
import { FiMenu, FiX } from "react-icons/fi";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
    children, 
    title = "Admin Dashboard",
    description = "Admin dashboard for managing courses, users, and analytics"
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                                Learning
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar - Fixed */}
            <div className="hidden lg:block fixed left-0 top-0 h-full w-64 xl:w-80 bg-card border-r border-border z-30 overflow-y-auto">
                <AdminSidebar />
            </div>
            
            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                        onClick={() => setSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-card border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out">
                        <AdminSidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}
            
            {/* Main Content Area */}
            <div className="lg:ml-64 xl:ml-80">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-card border-b border-border">
                    <DashBoardHeader />
                </div>
                
                {/* Page Content */}
                <div className="min-h-screen">
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout; 