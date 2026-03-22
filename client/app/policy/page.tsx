"use client";

import { useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Policy from "./Policy";
import Footer from "../components/Footer";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title="Policy | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                route={route}
            />
            <Policy />
            <Footer />
        </div>
    );
};

export default Page;