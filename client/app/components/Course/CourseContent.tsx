"use client";

import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../../app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";
import Header from "../Header";
import { FiBookOpen, FiPlay, FiClock, FiUsers } from "react-icons/fi";

type Props = {
    id: string;
    user: any;
};

const CourseContent = ({ id, user }: Props) => {
    const {
        data: contentData,
        isLoading,
        refetch,
    } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
    const data = contentData?.content;
    const [activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    if (isLoading) {
        return <Loader />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    activeItem={1}
                    open={open}
                    setOpen={setOpen}
                    route={route}
                    setRoute={setRoute}
                />
                <div className="container-responsive pt-20">
                    <div className="text-center py-20">
                        <FiBookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">No Content Available</h2>
                        <p className="text-muted-foreground">This course doesn't have any content yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentVideo = data[activeVideo];
    const totalVideos = data.length;
    const totalDuration = data.reduce((acc: number, video: any) => acc + video.videoLength, 0);
    const totalHours = Math.floor(totalDuration / 60);
    const totalMinutes = totalDuration % 60;

    return (
        <div className="min-h-screen bg-background">
                    <Header
                        activeItem={1}
                        open={open}
                        setOpen={setOpen}
                        route={route}
                        setRoute={setRoute}
                    />
            
                        <Heading
                title={currentVideo?.title}
                description="Continue your learning journey with expert-led content"
                keywords={currentVideo?.tags}
            />

            <div className="container-responsive pt-6">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Course Stats */}
                        <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FiPlay className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Lesson</p>
                                        <p className="font-semibold text-foreground">{activeVideo + 1} of {totalVideos}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-5 h-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Duration</p>
                                        <p className="font-semibold text-foreground">
                                            {totalHours}h {totalMinutes}m
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                        <FiUsers className="w-5 h-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Progress</p>
                                        <p className="font-semibold text-foreground">
                                            {Math.round(((activeVideo + 1) / totalVideos) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Player */}
                            <CourseContentMedia
                                data={data}
                                activeVideo={activeVideo}
                                setActiveVideo={setActiveVideo}
                                id={id}
                                user={user}
                                refetch={refetch}
                            />
                        </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-card rounded-xl border border-border shadow-soft">
                                <div className="p-6 border-b border-border">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Course Content
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {totalVideos} lessons • {totalHours}h {totalMinutes}m
                                    </p>
                                </div>
                                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <CourseContentList
                                setActiveVideo={setActiveVideo}
                                data={data}
                                activeVideo={activeVideo}
                            />
                        </div>
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseContent;