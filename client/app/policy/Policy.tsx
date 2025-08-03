import { FiShield, FiLock, FiEye, FiUserCheck } from "react-icons/fi";

const Policy = () => {
    const policies = [
        {
            icon: FiShield,
            title: "Data Protection",
            description: "We implement industry-standard security measures to protect your personal information and ensure it remains confidential and secure."
        },
        {
            icon: FiLock,
            title: "Privacy Control",
            description: "You have full control over your personal data. You can access, modify, or delete your information at any time through your account settings."
        },
        {
            icon: FiEye,
            title: "Transparency",
            description: "We are transparent about how we collect, use, and share your information. Our privacy practices are clearly outlined in this policy."
        },
        {
            icon: FiUserCheck,
            title: "User Rights",
            description: "You have the right to know what data we collect, how we use it, and to request deletion of your personal information at any time."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                        <FiShield className="w-4 h-4" />
                        <span>Privacy Policy</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Privacy Policy -{" "}
                        <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                            ELearning
                        </span>
            </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                </div>

                {/* Policy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {policies.map((policy, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover-lift"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <policy.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {policy.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {policy.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 shadow-sm">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Information We Collect
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                We collect information you provide directly to us, such as when you create an account, 
                                enroll in a course, or contact us for support. This may include your name, email address, 
                                payment information, and course preferences.
                            </p>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                                How We Use Your Information
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                We use the information we collect to provide, maintain, and improve our services, 
                                process your payments, communicate with you about your account and courses, and 
                                send you updates about new features and offerings.
                            </p>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                                Information Sharing
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                We do not sell, trade, or otherwise transfer your personal information to third parties 
                                without your consent, except as described in this policy. We may share your information 
                                with trusted third-party service providers who assist us in operating our platform.
                            </p>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                                Data Security
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                We implement appropriate technical and organizational security measures to protect 
                                your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                                Your Rights
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                You have the right to access, correct, or delete your personal information. You can 
                                also object to or restrict certain processing of your data. To exercise these rights, 
                                please contact us through our support channels.
                            </p>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                                Contact Us
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                If you have any questions about this Privacy Policy or our data practices, please 
                                contact us at privacy@elearning.com. We are committed to addressing your concerns 
                                and ensuring your privacy is protected.
                            </p>
                            
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-8">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <strong>Last updated:</strong> January 2024
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    This privacy policy is effective as of the date listed above and will remain in effect 
                                    except with respect to any changes in its provisions in the future.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Policy;