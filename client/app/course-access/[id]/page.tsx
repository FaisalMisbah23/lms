"use client";

import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "@/app/components/Course/CourseContent";
import { toast } from "react-hot-toast";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;

    const {
        isLoading,
        error,
        data,
        refetch,
        isFetching
    } = useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        refetch(); // Force refresh on mount to get latest purchase data
    }, []);

    useEffect(() => {
        if (!isLoading && data) {
            const isPurchased = data.user.courses.find(
                (item: any) => item.courseId === id
            );
            if (!isPurchased) {
                toast.error("You don't have access to this course.");
                redirect("/");
            }
        }

        if (!isLoading && error) {
            toast.error("Failed to load user data.");
            redirect("/");
        }
    }, [isLoading, data, error]);

    if (isLoading || isFetching || !data) {
        return <Loader />;
    }

    return (
        <div>
            <CourseContent id={id} user={data.user} />
        </div>
    );
};

export default Page;
