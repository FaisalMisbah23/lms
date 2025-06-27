'use client';
import React, { useState } from 'react';
import Header from './components/Header';
import Heading from './utils/Heading';
import Hero from './components/Route/Hero';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer';
import Reviews
  from './components/Route/Reviews';
import Courses from './components/Route/Courses';

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");


  return (
    <div>
      <Heading
        title="Elearning"
        description="ELearning is the Platform for students to learn and get help from teachers"
        keywords="Programming,Mern,Ai,Ml"
      />
      <Header open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route} />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;