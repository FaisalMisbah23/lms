
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

    const { data, isLoading } = useGetCourseDetailsQuery(id);
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

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Heading
                        title={data.course.name + "-Elearning"}
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
            )}
        </>
    );
};

export default CourseDetailsPage;