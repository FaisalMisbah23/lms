"use client"

import { FC, useState } from "react"
import { IoMdNotificationsOutline } from "react-icons/io"
import { format } from "timeago.js"
import ThemeSwitcher from "../../../app/utils/ThemeSwitcher"

// Static notifications data
const notifications = [
    {
        _id: "1",
        title: "New Message",
        message: "You have received a new message from John Doe.",
        createdAt: new Date().toISOString(),
    },
    {
        _id: "2",
        title: "System Update",
        message: "A new system update is available. Click here to update.",
        createdAt: new Date().toISOString(),
    },
    {
        _id: "3",
        title: "Reminder",
        message: "Your meeting with the team starts in 30 minutes.",
        createdAt: new Date().toISOString(),
    },
    {
        _id: "4",
        title: "New Comment",
        message: "Alice commented on your post: 'Great work!'",
        createdAt: new Date().toISOString(),
    },
]

type Props = {
    open?: boolean
    setOpen?: (open: boolean) => void
}

const DashboardHeader: FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[9999999]">
            <ThemeSwitcher />
            <div
                className="relative cursor-pointer m-2"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
                <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
                    {notifications.length}
                </span>
            </div>
            {isOpen && (
                <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-[1000000000] rounded">
                    <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
                        Notifications
                    </h5>
                    {notifications.map((item) => (
                        <div
                            className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                            key={item._id}
                        >
                            <div className="w-full flex items-center justify-between p-2">
                                <p className="text-black dark:text-white">{item.title}</p>
                                <p className="text-black dark:text-white cursor-pointer opacity-50">
                                    Mark as read
                                </p>
                            </div>
                            <p className="px-2 text-black dark:text-white">{item.message}</p>
                            <p className="p-2 text-black dark:text-white text-[14px]">
                                {format(item.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DashboardHeader