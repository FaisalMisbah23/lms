import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import ReviewCard from "../Review/ReviewCard";
import { FiStar, FiUsers, FiAward } from "react-icons/fi";
import { BsQuote } from "react-icons/bs";


const Reviews = () => {
    const router = useRouter();

    const handleStartLearning = () => {
        router.push("/courses");
    };

    const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            profession: "Student | Cambridge University",
            rating: 5,
        comment:
                "I had the pleasure of exploring ELearning, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience, as the website offers a comprehensive selection of courses that cater to different skill levels and interests.",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            profession: "Full Stack Developer | Quarter Ltd.",
            rating: 5,
        comment:
                "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts is truly impressive.",
    },
    {
        name: "Jay Gibbs",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            profession: "Computer Systems Engineering Student | Zimbabwe",
            rating: 5,
        comment:
                "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts is truly impressive.",
    },
    {
        name: "Mina Davidson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Junior Web Developer | Indonesia",
            rating: 5,
        comment:
                "I had the pleasure of exploring ELearning, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience.",
    },
    {
        name: "Rosemary Smith",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            profession: "Full Stack Web Developer | Algeria",
            rating: 5,
        comment:
                "Your content is very special. The thing I liked the most is that the videos are so long, which means they cover everything in details. Any person with beginner-level can complete an integrated project when they watch the videos.",
    },
    {
        name: "Laura Mckenzie",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            profession: "Full Stack Web Developer | Canada",
            rating: 5,
        comment:
                "Join ELearning! ELearning focuses on practical applications rather than just teaching the theory behind programming languages or frameworks. I took a lesson on creating a web marketplace using React JS, and it was very helpful.",
        },
    ];

    const stats = [
        { icon: FiUsers, value: "50K+", label: "Happy Students" },
        { icon: FiStar, value: "4.9", label: "Average Rating" },
        { icon: FiAward, value: "100+", label: "Expert Instructors" },
    ];

    return (
        <section className="py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container-responsive">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                        <BsQuote className="w-4 h-4" />
                        <span>Student Testimonials</span>
                </div>
                    
                    <h2 className="heading-responsive font-bold text-balance mb-6 text-gray-900 dark:text-white">
                        Our Students Are{" "}
                        <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                            Our Strength
                        </span>
                    <br />
                        See What They Say About Us
                    </h2>
                    
                    <p className="text-responsive text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover why thousands of students choose ELearning for their learning journey. 
                        Our platform has helped countless individuals achieve their career goals and unlock their potential.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover-lift"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Reviews Grid */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <div 
                                key={index}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ReviewCard item={review} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <BsQuote className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Reviews Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Be the first to leave a review after completing a course!
                        </p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="text-center mt-12 animate-fade-in">
                    <div className="bg-gradient-to-r from-primary/10 to-brand-600/10 rounded-2xl p-8 border border-primary/20 bg-white dark:bg-gray-800">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Ready to Join Our Community?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Start your learning journey today and become part of our growing community of successful students.
                        </p>
                        <button 
                            onClick={handleStartLearning}
                            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <span>Start Learning Now</span>
                        </button>
                    </div>
            </div>
            </div>
        </section>
    );
};

export default Reviews;