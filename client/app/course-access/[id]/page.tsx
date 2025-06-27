"use client";

import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "@/app/components/Course/CourseContent";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const id = params?.id as string;
    const { isLoading, error, data } = useLoadUserQuery(undefined, {});

    useEffect(() => {
        if (data) {
            const isPurchased = data.user.courses.find(
                (item: any) => item._id === id
            );
            if (!isPurchased) {
                redirect("/");
            }
        }
        if (error) {
            redirect("/");
        }
    }, [data, error]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <CourseContent id={id} user={data.user} />
                </div>
            )}
        </>
    );
};

export default Page;