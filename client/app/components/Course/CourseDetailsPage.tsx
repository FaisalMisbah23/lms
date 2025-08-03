
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
    useCreatePaymentMutation,
    useGetStripePublishAbleKeyQuery,
} from "@/redux/features/orders/ordersApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
    id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    const { data, isLoading, error } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishAbleKeyQuery({});
    const [createPayment, { data: paymentIntentData }] =
        useCreatePaymentMutation();

    const { data: userData } = useLoadUserQuery(undefined, {});
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (config) {
            const stripePublishableKey = config?.stripePublishableKey;
            setStripePromise(loadStripe(stripePublishableKey));
        }
        if (data && userData?.user) {
            const amount = Math.round(data.course.price * 100);
            createPayment(amount);
        }
    }, [config, createPayment, data, userData]);

    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.client_secret);
        }
    }, [paymentIntentData]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Course Not Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        The course you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <Heading
                title={data.course.name + " - ELearning"}
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords={data?.course.tags}
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={1}
                setRoute={setRoute}
                route={route}
            />
            <CourseDetails
                data={data.course}
                stripePromise={stripePromise}
                clientSecret={clientSecret}
                setRoute={setRoute}
                setOpen={setOpen}
            />
            <Footer />
        </div>
    );
};

export default CourseDetailsPage;