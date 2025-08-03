import { FiUsers, FiAward, FiBookOpen, FiTarget } from "react-icons/fi";

const About = () => {
    const stats = [
        { icon: FiUsers, value: "500K+", label: "Active Students" },
        { icon: FiAward, value: "100+", label: "Expert Instructors" },
        { icon: FiBookOpen, value: "1000+", label: "Courses Available" },
        { icon: FiTarget, value: "95%", label: "Success Rate" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                        <FiUsers className="w-4 h-4" />
                        <span>About ELearning</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        What is{" "}
                        <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                            ELearning
                        </span>
                        ?
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        A premier programming community dedicated to helping new programmers achieve their goals and reach their full potential.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
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

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 shadow-sm">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                Are you ready to take your programming skills to the next level? Look
                                no further than ELearning, the premier programming community dedicated
                                to helping new programmers achieve their goals and reach their full
                                potential.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                As the founder and CEO of ELearning, I know firsthand the challenges
                                that come with learning and growing in the programming industry.
                                That's why I created ELearning – to provide new programmers with the
                                resources and support they need to succeed.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                Our YouTube channel is a treasure trove of informative videos on
                                everything from programming basics to advanced techniques. But that's
                                just the beginning. Our affordable courses are designed to give you
                                the high-quality education you need to succeed in the industry,
                                without breaking the bank.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                At ELearning, we believe that price should never be a barrier to
                                achieving your dreams. That's why our courses are priced low – so that
                                anyone, regardless of their financial situation, can access the tools
                                and knowledge they need to succeed.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                But ELearning is more than just a community – we're a family. Our
                                supportive community of like-minded individuals is here to help you
                                every step of the way, whether you're just starting out or looking to
                                take your skills to the next level.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                With ELearning by your side, there's nothing standing between you and
                                your dream job. Our courses and community will provide you with the
                                guidance, support, and motivation you need to unleash your full
                                potential and become a skilled programmer.
                            </p>
                            
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                                So what are you waiting for? Join the ELearning family today and let's
                                conquer the programming industry together! With our affordable
                                courses, informative videos, and supportive community, the sky's the
                                limit.
                            </p>
                        </div>

                        {/* Author Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">J</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        John Doe
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Founder and CEO of ELearning
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;