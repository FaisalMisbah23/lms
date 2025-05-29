'use client'
import React, { FC, useState } from 'react';
import Protected from "../hooks/useProtected"
import Header from '../components/Header';
import Profile from '../components/Profile/Profile';
import { useSelector } from 'react-redux';
import Heading from '../utils/Heading';
type Props = {}
const page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth)
  return (
    <div>
      <Protected>
        <Heading
          title={`${user.name} Profile`}
          description="An e-learning platform where students can learn and receive guidance from teachers"
          keywords="Programming, MERN Stack, AI, Machine Learning"
        />
        <Header open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route} />
        <Profile user={user}></Profile>
      </Protected>
    </div>
  )
}

export default page