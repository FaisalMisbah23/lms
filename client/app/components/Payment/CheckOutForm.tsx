import { styles } from "@/app/style/style";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import {
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSocket } from "@/app/lib/socketClient"

type Props = {
    setOpen: any;
    data: any;
    user: any;
    refetch: any;
};

// from: https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/client/react-cra/src/CheckoutForm.jsx
const CheckOutForm = ({ data, user }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<any>("");
    const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error("Payment system not ready. Please wait and try again.");
            return;
        }

        setIsLoading(true);

        toast.loading("Processing payment...");

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            toast.dismiss();
            toast.error(`Payment failed: ${error.message}`);
            setMessage(error.message);
            setIsLoading(false);
            return;
        }

        // Fallback logic
        let finalPaymentIntent = paymentIntent;

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            const clientSecret = elements._clientSecret;
            if (!clientSecret) {
                toast.dismiss();
                toast.error("Something went wrong. Please refresh and try again.");
                setIsLoading(false);
                return;
            }

            const result = await stripe.retrievePaymentIntent(clientSecret);
            finalPaymentIntent = result.paymentIntent;
        }

        // Final success condition
        if (finalPaymentIntent && finalPaymentIntent.status === "succeeded") {
            toast.dismiss();
            toast.success("🎉 Payment successful! Unlocking course...");
            createOrder({
                courseId: data._id,
                payment_info: finalPaymentIntent,
            });
        } else {
            toast.dismiss();
            toast.error("Payment not completed. Please try again.");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                if (refetch) {
                    await refetch(); // Ensure user has course access
                }
    
                toast.dismiss(); // Clear any loading toasts
                toast.success("🎉 Course purchased successfully!");
    
                getSocket().emit("notification", {
                    title: "New Order",
                    message: `You have a new order from ${data.name}`,
                    userId: user._id,
                });
    
                setTimeout(() => {
                    redirect(`/course-access/${data._id}`);
                }, 1000);
            } catch (err) {
                toast.error("⚠️ Course access update failed. Try refreshing.");
            }
        };
    
        if (orderData) {
            handleRedirect();
        }
    
        if (error) {
            toast.error("❌ Order creation failed after payment.");
        }
    }, [orderData, error]);
    


    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
                    {isLoading ? "Paying..." : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && (
                <div id="payment-message" className="text-[red] font-Poppins pt-2">
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckOutForm;