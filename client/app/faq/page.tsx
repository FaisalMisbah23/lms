"use client";

import { useState } from "react";
import FAQ from "../components/FAQ/FAQ";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Footer from "../components/Footer";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(4);
    const [route, setRoute] = useState("Login");

    return (
        <div className="min-h-screen">
            <Heading
                title="FAQ | Elearning"
                description="Elearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            />
            <FAQ />
            <Footer />
        </div>
    );
};

export default Page;