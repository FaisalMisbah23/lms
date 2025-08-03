import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import React from "react";
import { FiStar } from "react-icons/fi";
import { BsQuote } from "react-icons/bs";

type Props = {
    item: any;
};

const ReviewCard = (props: Props) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover-lift p-6 transition-all duration-300 group">
            {/* Quote Icon */}
            <div className="flex justify-end mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <BsQuote className="w-4 h-4 text-primary" />
                </div>
            </div>

            {/* Review Content */}
            <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    "{props.item.comment}"
                </p>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Image
                        src={props.item.avatar}
                        alt={props.item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                    {/* Online Status */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {props.item.name}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {props.item.profession}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                            <FiStar
                                key={index}
                                className={`w-4 h-4 ${
                                    index < (props.item.rating || 5)
                                        ? "text-yellow-500 fill-current"
                                        : "text-gray-300 dark:text-gray-600"
                                }`}
                            />
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                            {props.item.rating || 5}.0
                        </span>
                    </div>
                </div>
            </div>

            {/* Verified Badge */}
            <div className="mt-4 flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Verified Student</span>
            </div>
        </div>
    );
};

export default ReviewCard;