"use client"

import { FC, useEffect, useRef, useState } from "react"
import { IoMdNotificationsOutline } from "react-icons/io"
import { format } from "timeago.js"
import ThemeSwitcher from "../../../app/utils/ThemeSwitcher"
import socketIO from "socket.io-client"
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationApi"
import { FiBell, FiX } from "react-icons/fi"

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

type Props = {
    open?: boolean
    setOpen?: (open: boolean) => void
}

const DashboardHeader: FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const { data, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation()
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio(
                "https://res.cloudinary.com/dasdrngo1/video/upload/v1715355770/notifications/mixkit-bubble-pop-up-alert-notification-2357_wbwviv.wav"
            );
        }
    }, []);

    const playNotificationSound = () => {
        audioRef.current?.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    };

    useEffect(() => {
        if (data) {
            setNotifications(data.notifications.filter((item: any) => item.status === "unread"))
        }
        if (isSuccess) {
            refetch();
        }
    }, [data, isSuccess])

    useEffect(() => {
        socketId.on("newNotification", (data) => {
            refetch()
            playNotificationSound();
        })
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationStatusChange = async (id: string) => {
        await updateNotificationStatus(id);
    }

    return (
        <div className="w-full bg-card border-b border-border px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                {/* Left side - Dashboard title */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Welcome back! Here's what's happening with your courses today.
                    </p>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <ThemeSwitcher />

                    {/* Notifications */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <FiBell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                                    {notifications.length > 99 ? '99+' : notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isOpen && (
                            <div className="absolute left-0 sm:left-auto sm:right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-card border border-border rounded-xl shadow-lg z-50">
                                <div className="p-3 sm:p-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-foreground text-sm sm:text-base">Notifications</h3>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <FiX className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 sm:p-6 text-center">
                                            <FiBell className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-xs sm:text-sm text-muted-foreground">No new notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map((item) => (
                                            <div
                                                key={item._id}
                                                className="p-3 sm:p-4 border-b border-border hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-start justify-between space-x-2 sm:space-x-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-foreground text-sm sm:text-base mb-1 truncate">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                                                            {item.message}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {format(item.createdAt)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleNotificationStatusChange(item._id)}
                                                        className="text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                                                    >
                                                        Mark as read
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader