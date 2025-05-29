'use client';
import React, { FC, useState } from 'react';
import Header from './components/Header';
import Heading from './utils/Heading';
import Hero from './components/Route/Hero';
interface Props { }

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");


  return (
    <div>
      <Heading
        title="E-Learning Platform"
        description="An e-learning platform where students can learn and receive guidance from teachers"
        keywords="Programming, MERN Stack, AI, Machine Learning"
      />
      <Header open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route} />
      <Hero />
    </div>
  );
};

export default Page;
