import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { FiChevronDown, FiHelpCircle, FiMessageCircle, FiMail, FiPhone } from "react-icons/fi";

const FAQ = () => {
    const { data } = useGetHeroDataQuery("FAQ", {});
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions(data.layout?.faqs || []);
        }
    }, [data]);

    const toggleQuestion = (id: string) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    const defaultQuestions = [
        {
            _id: "1",
            question: "How do I get started with ELearning?",
            answer: "Getting started is easy! Simply create an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment."
        },
        {
            _id: "2", 
            question: "What types of courses do you offer?",
            answer: "We offer a wide variety of courses including programming, web development, data science, design, business, and many more. Our courses range from beginner to advanced levels."
        },
        {
            _id: "3",
            question: "Do you offer certificates upon completion?",
            answer: "Yes! All our courses come with a certificate of completion that you can download and share on your professional profiles like LinkedIn."
        },
        {
            _id: "4",
            question: "Can I access courses on mobile devices?",
            answer: "Absolutely! Our platform is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers."
        },
        {
            _id: "5",
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and other popular payment methods. We also offer secure payment processing for your peace of mind."
        },
        {
            _id: "6",
            question: "Is there a money-back guarantee?",
            answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your course, you can request a full refund within 30 days of purchase."
        }
    ];

    // Use dynamic FAQ data from API, fallback to defaults if no data
    const displayQuestions = questions.length > 0 ? questions : defaultQuestions;

    const contactMethods = [
        {
            icon: FiMail,
            title: "Email Support",
            description: "Get help via email",
            contact: "support@elearning.com",
            href: "mailto:support@elearning.com"
        },
        {
            icon: FiPhone,
            title: "Phone Support", 
            description: "Call us directly",
            contact: "+1 (555) 123-4567",
            href: "tel:+15551234567"
        },
        {
            icon: FiMessageCircle,
            title: "Live Chat",
            description: "Chat with our team",
            contact: "Available 24/7",
            href: "#"
        }
    ];

    return (
        <section className="py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container-responsive">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-sm">
                        <FiHelpCircle className="w-4 h-4" />
                        <span>Frequently Asked Questions</span>
                    </div>
                    
                    <h2 className="heading-responsive font-bold text-balance mb-6 text-gray-900 dark:text-white">
                        Got Questions? We've Got{" "}
                        <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                            Answers
                        </span>
                    </h2>
                    
                    <p className="text-responsive text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Find answers to the most commonly asked questions about our platform, courses, and learning experience.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {displayQuestions.map((question, index) => (
                            <div
                                key={question._id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                    <button
                                    className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    onClick={() => toggleQuestion(question._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                            {question.question}
                                        </h3>
                                        <div className="flex-shrink-0">
                                            <FiChevronDown
                                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                                    activeQuestion === question._id ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>
                                    </div>
                                    </button>
                                
                                {activeQuestion === question._id && (
                                    <div className="px-6 pb-6 animate-accordion-down">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {question.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 text-center animate-fade-in">
                    <div className="bg-gradient-to-r from-primary/10 to-brand-600/10 rounded-2xl p-8 border border-primary/20 bg-white dark:bg-gray-800">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Still Have Questions?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactMethods.map((method, index) => (
                                <a
                                    key={index}
                                    href={method.href}
                                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift transition-all duration-200"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                        <method.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {method.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        {method.description}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                        {method.contact}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;