
import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FiPlay, FiClock } from "react-icons/fi";

type Props = {
    data: any;
    activeVideo?: number;
    setActiveVideo?: any;
    isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set<string>()
    );

    // Find unique video sections
    const videoSections: string[] = [
        ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
    ];

    let totalCount: number = 0; // Total count of videos from previous sections

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };

    return (
        <div className="space-y-4">
            {videoSections.map((section: string) => {
                const isSectionVisible = visibleSections.has(section);

                // Filter videos by section
                const sectionVideos: any[] = props.data.filter(
                    (item: any) => item.videoSection === section
                );

                const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
                const sectionVideoLength: number = sectionVideos.reduce(
                    (totalLength: number, item: any) => totalLength + item.videoLength,
                    0
                );
                const sectionStartIndex: number = totalCount; // Start index of videos within the current section
                totalCount += sectionVideoCount; // Update the total count of videos

                const sectionContentHours: number = sectionVideoLength / 60;

                return (
                    <div
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        key={section}
                    >
                        {/* Section Header */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {section}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center space-x-1">
                                            <FiPlay className="w-4 h-4" />
                                            <span>{sectionVideoCount} Lessons</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <FiClock className="w-4 h-4" />
                                            <span>
                                                {sectionVideoLength < 60
                                                    ? sectionVideoLength
                                                    : sectionContentHours.toFixed(2)}{" "}
                                                {sectionVideoLength > 60 ? "hours" : "minutes"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => toggleSection(section)}
                                >
                                    {isSectionVisible ? (
                                        <BsChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    ) : (
                                        <BsChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section Content */}
                        {isSectionVisible && (
                            <div className="bg-white dark:bg-gray-800">
                                {sectionVideos.map((item: any, index: number) => {
                                    const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the overall list
                                    const contentLength: number = item.videoLength / 60;
                                    return (
                                        <div
                                            className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                                videoIndex === props.activeVideo 
                                                    ? "bg-primary/5 border-l-4 border-l-primary" 
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            } transition-all duration-200`}
                                            key={item._id}
                                            onClick={() =>
                                                props.isDemo ? null : props?.setActiveVideo(videoIndex)
                                            }
                                        >
                                            <div className="p-4 cursor-pointer">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <MdOutlineOndemandVideo
                                                            size={20}
                                                            className="text-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                                                            {item.title}
                                                        </h4>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <FiClock className="w-3 h-3" />
                                                            <span>
                                                                {item.videoLength > 60
                                                                    ? contentLength.toFixed(2)
                                                                    : item.videoLength}{" "}
                                                                {item.videoLength > 60 ? "hours" : "minutes"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CourseContentList;