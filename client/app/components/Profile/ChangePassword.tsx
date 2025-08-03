"use client"

import { FC, useEffect, useState } from "react"
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi"
import toast from "react-hot-toast"
import { FiLock, FiEye, FiEyeOff, FiSave } from "react-icons/fi"

const ChangePassword: FC = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [updatePassword, { isSuccess, error, isLoading }] = useUpdatePasswordMutation()

    const passwordChangeHandler = async (e: any) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        await updatePassword({ oldPassword, newPassword })
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password changed successfully!")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }
        if (error) {
            const errorMessage = error && "data" in error ? (error.data as any)?.message : "Password change failed"
            toast.error(errorMessage)
        }
    }, [isSuccess, error])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Change Password
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Update your password to keep your account secure
                </p>
            </div>

            <form onSubmit={passwordChangeHandler} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter your current password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 6 characters long
                    </p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{isLoading ? "Updating..." : "Change Password"}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword