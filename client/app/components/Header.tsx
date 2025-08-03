"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { useTheme } from "next-themes";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiOutlineX } from "react-icons/hi";
import { FiSearch, FiBell, FiBookmark } from "react-icons/fi";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assests/avatardefault.jpg";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface HeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

const Header: FC<HeaderProps> = ({
  activeItem,
  setOpen,
  open,
  route,
  setRoute,
}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [logout, setLogout] = useState(false);
  const { theme } = useTheme();
  const { user } = useSelector((state: any) => state.auth)
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {})
  const { data } = useSession();
  const [socialAuth] = useSocialAuthMutation();
  const { } = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  })

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoading && !userData && data?.user?.email) {
        try {
          await socialAuth({
            email: data.user.email,
            name: data.user.name,
            avatar: data.user.image,
          }).unwrap();
          await refetch();
          toast.success("Login successful");
        } catch (err) {
          console.error("Error during socialAuth:", err);
        }
      }

      if (!data && !isLoading && !userData) {
        setLogout(true);
      }
    };

    syncUser();
  }, [data, userData, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
        setOpenSidebar(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        active 
          ? "bg-background border-b border-border shadow-medium lg:bg-background/95 lg:backdrop-blur-md" 
          : "bg-background border-b border-border shadow-sm lg:bg-background/98 lg:backdrop-blur-sm"
      }`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-brand-600 rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow/50 transition-all duration-300">
                <span className="text-white font-bold text-lg lg:text-xl">E</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                Learning
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
                <NavItems activeItem={activeItem} isMobile={false} />
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Switcher */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Theme:</span>
                <ThemeSwitcher />
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden lg:block">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
                </div>

              {/* User Menu */}
                {userData ? (
                <div className="flex items-center space-x-3">
                  <Link href="/profile" className="group">
                    <div className="relative">
                    <Image
                        src={userData?.user.avatar ? userData?.user.avatar.url : avatar}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-200"
                      />
                      {activeItem === 5 && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                      )}
                    </div>
                  </Link>
                </div>
                ) : (
                <button
                    onClick={() => setOpen(true)}
                  className="btn btn-primary btn-sm hidden lg:flex"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpenSidebar(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <HiOutlineMenuAlt3 size={24} />
              </button>
            </div>
            </div>
          </div>

        {/* Mobile Sidebar */}
          {openSidebar && (
            <div
            className="fixed inset-0 z-50 lg:hidden"
              onClick={handleClose}
              id="screen"
            >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card border-l border-border shadow-large">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">E</span>
                    </div>
                    <span className="text-xl font-bold">Learning</span>
                  </Link>
                  <button
                    onClick={() => setOpenSidebar(false)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <HiOutlineX size={24} />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-6">
                    <NavItems activeItem={activeItem} isMobile={true} />
                </div>

                {/* User Actions */}
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Theme:</span>
                      <ThemeSwitcher />
                    </div>
                  </div>
                  
                  {userData ? (
                    <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <Image
                        src={userData?.user.avatar ? userData?.user.avatar.url : avatar}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{userData?.user.name}</p>
                        <p className="text-sm text-muted-foreground">{userData?.user.email}</p>
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setOpen(true);
                        setOpenSidebar(false);
                      }}
                      className="w-full btn btn-primary"
                    >
                      Sign In
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    © 2024 ELearning. All rights reserved.
                  </p>
                </div>
                </div>
              </div>
            </div>
          )}
      </header>

      {/* Auth Modals */}
        {route === "Login" && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
                refetch={refetch}
              />
        )}

        {route === "Sign-Up" && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
                refetch={refetch}
              />
        )}

        {route === "Verification" && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Verification}
                refetch={refetch}
              />
            )}

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;