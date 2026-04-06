"use client"

import { FC } from "react"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi"
import { useSession } from "next-auth/react"
import { useLogOutQuery } from "@/redux/features/auth/authApi"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { FiUser, FiLock, FiBookOpen, FiLogOut, FiCamera, FiSettings } from "react-icons/fi"
import Link from "next/link"

type Props = {
    user: any
    active: number
    avatar: string
    setActive: (active: number) => void
    logOutHandler: any
}

const SideBarProfile: FC<Props> = ({
    user,
    active,
    avatar,
    setActive,
    logOutHandler,
}) => {
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation()
    const { data: userData } = useLoadUserQuery(undefined, {})
    const { data } = useSession()

    const imageHandler = async (e: any) => {
        const fileReader = new FileReader()

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result
                updateAvatar(avatar)
            }
        }
        fileReader.readAsDataURL(e.target.files[0])
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-soft p-6">
            {/* User Info */}
            <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
                        <img
                            src={
                                userData?.user?.avatar?.url ||
                                user?.avatar?.url ||
                                "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <FiCamera className="w-4 h-4" />
                    </label>
                    <input
                        type="file"
                        name=""
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                    {userData?.user?.name || user?.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {userData?.user?.email || user?.email}
                </p>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
                <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        active === 1
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/90 hover:bg-muted"
                    }`}
                onClick={() => setActive(1)}
            >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                </button>

                <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        active === 2
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/90 hover:bg-muted"
                    }`}
                onClick={() => setActive(2)}
            >
                    <FiLock className="w-5 h-5" />
                    <span className="font-medium">Change Password</span>
                </button>

                <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        active === 3
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/90 hover:bg-muted"
                    }`}
                onClick={() => setActive(3)}
            >
                    <FiBookOpen className="w-5 h-5" />
                    <span className="font-medium">My Courses</span>
                </button>

                {/* Admin Dashboard Button */}
                {(userData?.user?.role === "admin" || user?.role === "admin") && (
                    <Link
                        href="/admin"
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-foreground/90 hover:bg-muted"
                    >
                        <FiSettings className="w-5 h-5" />
                        <span className="font-medium">Admin Dashboard</span>
                    </Link>
                )}
            </div>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-border">
                <button
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    onClick={logOutHandler}
                >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default SideBarProfile