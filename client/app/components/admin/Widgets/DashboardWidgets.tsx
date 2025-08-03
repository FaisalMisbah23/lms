import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Orders/AllInvoices";
import {
    useGetOrdersAnalyticsQuery,
    useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import { FiTrendingUp, FiTrendingDown, FiUsers, FiShoppingCart } from "react-icons/fi";

type Props = {
    open?: boolean;
    value?: number;
};

const CircularProgress: FC<Props> = ({ open, value }) => {
    const percentage = value || 0;
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 50 50">
                {/* Background circle */}
                <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${
                        percentage > 0 ? "text-green-500" : "text-red-500"
                    }`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold">
                    {percentage > 0 ? "+" : ""}{percentage.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
    const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
    const [userComparePercentage, setUserComparePercentage] = useState<any>();

    const { data, isLoading } = useGetUsersAnalyticsQuery({});
    const { data: ordersData, isLoading: ordersLoading } =
        useGetOrdersAnalyticsQuery({});

    useEffect(() => {
        if (isLoading && ordersLoading) {
            return;
        } else {
            if (data && ordersData) {
                const usersLastTwoMonths = data.users.last12Months.slice(-2);
                const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

                if (
                    usersLastTwoMonths.length === 2 &&
                    ordersLastTwoMonths.length === 2
                ) {
                    const usersCurrentMonth = usersLastTwoMonths[1].count;
                    const usersPreviousMonth = usersLastTwoMonths[0].count;
                    const ordersCurrentMonth = ordersLastTwoMonths[1].count;
                    const ordersPreviousMonth = ordersLastTwoMonths[0].count;

                    const usersPercentChange =
                        usersPreviousMonth !== 0
                            ? ((usersCurrentMonth - usersPreviousMonth) /
                                usersPreviousMonth) *
                            100
                            : 100;

                    const ordersPercentChange =
                        ordersPreviousMonth !== 0
                            ? ((ordersCurrentMonth - ordersPreviousMonth) /
                                ordersPreviousMonth) *
                            100
                            : 100;

                    setUserComparePercentage({
                        currentMonth: usersCurrentMonth,
                        previousMonth: usersPreviousMonth,
                        percentChange: usersPercentChange,
                    });

                    setOrdersComparePercentage({
                        currentMonth: ordersCurrentMonth,
                        previousMonth: ordersPreviousMonth,
                        percentChange: ordersPercentChange,
                    });
                }
            }
        }
    }, [isLoading, ordersLoading, data, ordersData]);

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Sales Card */}
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg flex-shrink-0">
                                    <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                    Sales Obtained
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                    {ordersComparePercentage?.currentMonth || 0}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {ordersComparePercentage?.percentChange > 0 ? (
                                        <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                    ) : (
                                        <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-medium ${
                                        ordersComparePercentage?.percentChange > 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                    }`}>
                                        {ordersComparePercentage?.percentChange > 0
                                            ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                                            : ordersComparePercentage?.percentChange.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                            <CircularProgress
                                value={ordersComparePercentage?.percentChange > 0 ? 100 : 0}
                                open={open}
                            />
                        </div>
                    </div>
                </div>

                {/* Users Card */}
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                                    <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                    New Users
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                    {userComparePercentage?.currentMonth || 0}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {userComparePercentage?.percentChange > 0 ? (
                                        <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                    ) : (
                                        <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-medium ${
                                        userComparePercentage?.percentChange > 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                    }`}>
                                        {userComparePercentage?.percentChange > 0
                                            ? "+" + userComparePercentage?.percentChange.toFixed(2)
                                            : userComparePercentage?.percentChange.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                            <CircularProgress
                                value={userComparePercentage?.percentChange > 0 ? 100 : 0}
                                open={open}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* User Analytics */}
                <div className="xl:col-span-2">
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                            User Analytics
                        </h3>
                        <div className="overflow-x-auto">
                            <UserAnalytics isDashboard={true} />
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                            Recent Transactions
                        </h3>
                        <div className="overflow-x-auto">
                            <AllInvoices isDashboard={true} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Analytics */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                    Orders Analytics
                </h3>
                <div className="overflow-x-auto">
                    <OrdersAnalytics isDashboard={true} />
                </div>
            </div>
        </div>
    );
};

export default DashboardWidgets;