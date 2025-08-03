"use client";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
    FiHome, 
    FiUsers, 
    FiFileText, 
    FiBarChart, 
    FiVideo, 
    FiPlusCircle, 
    FiGlobe, 
    FiHelpCircle, 
    FiTag, 
    FiSettings, 
    FiTrendingUp, 
    FiShoppingCart, 
    FiActivity, 
    FiLogOut,
    FiX
} from "react-icons/fi";
import avatarDefault from "../../../../public/assests/avatardefault.jpg";

interface itemProps {
    title: string;
    to: string;
    icon: React.ReactElement;
    selected: string;
    setSelected: any;
}

interface SidebarProps {
    onClose?: () => void;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
    return (
        <Link href={to}>
            <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    selected === title
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setSelected(title)}
            >
                <div className="w-5 h-5 flex-shrink-0">{icon}</div>
                <span className="font-medium truncate">{title}</span>
            </div>
        </Link>
    );
};

const Sidebar: FC<SidebarProps> = ({ onClose }) => {
    const { user } = useSelector((state: any) => state.auth);
    const [selected, setSelected] = useState("Dashboard");
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const [logout, setLogout] = useState(false);
    const pathname = usePathname();

    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });

    const logoutHandler = async () => {
        setLogout(true);
        await signOut({ redirect: false });
        window.location.href = "/";
    };

    useEffect(() => setMounted(true), []);

    // Update selected based on current pathname
    useEffect(() => {
        if (pathname) {
            const path = pathname.split('/').pop() || 'admin';
            const pathMap: { [key: string]: string } = {
                'admin': 'Dashboard',
                'users': 'Users',
                'invoices': 'Invoices',
                'create-course': 'Create Course',
                'courses': 'Live Courses',
                'hero': 'Hero',
                'faq': 'FAQ',
                'categories': 'Categories',
                'team': 'Manage Team',
                'courses-analytics': 'Courses Analytics',
                'orders-analytics': 'Orders Analytics',
                'users-analytics': 'Users Analytics',
            };
            const newSelected = pathMap[path] || 'Dashboard';
            setSelected(newSelected);
        }
    }, [pathname]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="h-full bg-card border-r border-border w-full">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-border">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent truncate">
                            Learning
                        </span>
                    </Link>
                    
                    {/* Only show close button on mobile */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 lg:p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                    <Image
                        alt="profile-user"
                        width={48}
                        height={48}
                        src={user.avatar ? user.avatar.url : avatarDefault}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                            {user?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize truncate">
                            {user?.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {/* Dashboard */}
                <div className="space-y-1">
                    <Item
                        title="Dashboard"
                        to="/admin"
                        icon={<FiHome />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Data
                        </h4>
                    </div>
                    <Item
                        title="Users"
                        to="/admin/users"
                        icon={<FiUsers />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Invoices"
                        to="/admin/invoices"
                        icon={<FiFileText />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>

                {/* Content Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Content
                        </h4>
                    </div>
                    <Item
                        title="Create Course"
                        to="/admin/create-course"
                        icon={<FiPlusCircle />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Live Courses"
                        to="/admin/courses"
                        icon={<FiVideo />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>

                {/* Customization Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Customization
                        </h4>
                    </div>
                    <Item
                        title="Hero"
                        to="/admin/hero"
                        icon={<FiGlobe />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="FAQ"
                        to="/admin/faq"
                        icon={<FiHelpCircle />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Categories"
                        to="/admin/categories"
                        icon={<FiTag />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>

                {/* Controllers Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Controllers
                        </h4>
                    </div>
                    <Item
                        title="Manage Team"
                        to="/admin/team"
                        icon={<FiUsers />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>

                {/* Analytics Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Analytics
                        </h4>
                    </div>
                    <Item
                        title="Courses Analytics"
                        to="/admin/courses-analytics"
                        icon={<FiBarChart />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Orders Analytics"
                        to="/admin/orders-analytics"
                        icon={<FiShoppingCart />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Users Analytics"
                        to="/admin/users-analytics"
                        icon={<FiActivity />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={logoutHandler}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full"
                >
                    <FiLogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium truncate">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;