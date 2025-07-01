"use client"

import { type FC, useEffect, useState } from "react"
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from "@/redux/features/auth/authApi"
import { signOut, useSession } from "next-auth/react"
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import CourseCard from "../Course/CourseCard"

type Props = { user: any }

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
                .map((userCourse: any) => data.courses.find((course: any) => userCourse._id === course._id))
                .filter((course: any) => course !== undefined);
            setCourses(filteredCourses);
        }
    }, [data, user.courses]);

    return (
        <div className="w-[85%] flex mx-auto">
            <div
                className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 dark:border-[#ffffff1d] border-[#fff] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"
                    }`}
            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler}
                />

            </div>

            <div className="w-full h-full bg-transparent mt-20">
                {active === 1 && <ProfileInfo user={user} avatar={avatar} />}
                {active === 2 && <ChangePassword />}
                {active === 3 && (
                    <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 xl:gap-[35px]">
                            {courses &&
                                courses.map((item: any, index: number) => (
                                    <CourseCard
                                        item={item}
                                        key={index}
                                        // user={user}
                                        isProfile={true}
                                    />
                                ))}
                        </div>
                        {courses.length === 0 && (
                            <h1 className="text-center text-[18px] font-Poppins">
                                You don&apos;t have any purchased courses!
                            </h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default Profile