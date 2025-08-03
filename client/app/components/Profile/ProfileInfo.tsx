"use client"

import { FC, useEffect, useState } from "react"
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi"
import { useEditProfileMutation } from "@/redux/features/user/userApi"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import toast from "react-hot-toast"
import { FiUser, FiMail, FiCamera, FiSave } from "react-icons/fi"

type Props = {
    avatar: string
    user: any
}

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user && user.name)
    const [updateAvatar, { isSuccess, isLoading, error }] = useUpdateAvatarMutation()
    const [EditProfile, { isSuccess: success, error: updateError, isLoading: updateLoading }] = useEditProfileMutation()
    const [loadUser, setLoadUser] = useState(false)
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true })

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

    useEffect(() => {
        if (isSuccess) {
            toast.success("Avatar updated successfully!")
            setLoadUser(true)
        }
        if (error) {
            const errorMessage = error && "data" in error ? (error.data as any)?.message : "Avatar update failed"
            toast.error(errorMessage)
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (success) {
            toast.success("Profile updated successfully!")
            setLoadUser(true)
        }
        if (updateError) {
            const errorMessage =
                updateError && "data" in updateError ? (updateError.data as any)?.message : "Profile update failed"
            toast.error(errorMessage)
        }
    }, [success, updateError])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (name !== "") {
            EditProfile(name)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Profile Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Update your personal information and profile picture
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600">
                            <img
                                src={
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
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Profile Picture
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Click the camera icon to upload a new profile picture
                        </p>
                    </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email address cannot be changed
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{updateLoading ? "Updating..." : "Update Profile"}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileInfo