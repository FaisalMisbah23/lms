"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import Header from "./components/Header";
import Heading from "./utils/Heading";
import Hero from "./components/Route/Hero";
import Footer from "./components/Footer";

function HomeSectionSkeleton() {
  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-hidden
    >
      <div className="h-8 w-48 bg-muted rounded-md animate-pulse mb-8" />
      <div className="h-40 bg-muted/60 rounded-xl animate-pulse" />
    </div>
  );
}

const Courses = dynamic(() => import("./components/Route/Courses"), {
  loading: () => <HomeSectionSkeleton />,
  ssr: true,
});

const Reviews = dynamic(() => import("./components/Route/Reviews"), {
  loading: () => <HomeSectionSkeleton />,
  ssr: true,
});

const FAQ = dynamic(() => import("./components/FAQ/FAQ"), {
  loading: () => <HomeSectionSkeleton />,
  ssr: true,
});

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Home | Elearning"
        description="Elearning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
