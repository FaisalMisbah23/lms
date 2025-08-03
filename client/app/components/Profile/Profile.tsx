"use client"

import { type FC, useEffect, useState } from "react"
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from "@/redux/features/auth/authApi"
import { signOut, useSession } from "next-auth/react"
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import CourseCard from "../Course/CourseCard"
import Footer from "../Footer"

type Props = {
    user: any;
}

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false)
    const [avatar, setAvatar] = useState("")
    const [active, setActive] = useState(1)
    const [logout, setLogOut] = useState(false)
    const [courses, setCourses] = useState<any>([]);
    const { data, isLoading } = useGetUserAllCoursesQuery(undefined, {});
    const { } = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });

    const logOutHandler = async () => {
        setLogOut(true);
        await signOut();
    }

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        })
    }

    useEffect(() => {
        if (data) {
            const filteredCourses = user.courses
                .map((userCourse: any) => data.courses.find((course: any) => userCourse.courseId === course._id))
                .filter((course: any) => course !== undefined);
            setCourses(filteredCourses);
        }
    }, [data, user.courses]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            My Profile
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage your account settings and view your courses
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className={`sticky ${scroll ? "top-24" : "top-8"}`}>
                            <SideBarProfile
                                user={user}
                                active={active}
                                avatar={avatar}
                                setActive={setActive}
                                logOutHandler={logOutHandler}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            {active === 1 && <ProfileInfo user={user} avatar={avatar} />}
                            {active === 2 && <ChangePassword />}
                            {active === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            My Courses
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Your purchased courses and learning progress
                                        </p>
                                    </div>

                                    {isLoading ? (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                Loading Your Courses...
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Please wait while we fetch your course data
                                            </p>
                                        </div>
                                    ) : courses && courses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {courses.map((item: any, index: number) => (
                                                <CourseCard
                                                    item={item}
                                                    key={index}
                                                    isProfile={true}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                No Courses Yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                                You haven't purchased any courses yet. Start your learning journey today!
                                            </p>
                                            <a
                                                href="/courses"
                                                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                                            >
                                                Browse Courses
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile