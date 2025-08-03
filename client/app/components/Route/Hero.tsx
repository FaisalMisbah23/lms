"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiPlay, FiUsers, FiStar, FiBookOpen } from "react-icons/fi";
import Loader from "../Loader/Loader";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

import Client1 from "../../../public/assests/client-1.jpg";
import Client2 from "../../../public/assests/client-2.jpg";
import Client3 from "../../../public/assests/client-3.jpg";

const Hero = () => {
  const clients = [Client1, Client2, Client3];
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/courses?title=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleExploreCourses = () => {
    router.push("/courses");
  };

  const stats = [
    { icon: FiUsers, value: "500K+", label: "Active Students" },
    { icon: FiStar, value: "4.9", label: "Average Rating" },
    { icon: FiBookOpen, value: "1000+", label: "Courses Available" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 pt-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <FiStar className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Trusted by 500K+ learners</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {data?.layout?.banner?.title || "Master New Skills with Expert-Led Courses"}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {data?.layout?.banner?.subTitle || "Join thousands of learners and unlock your potential with our comprehensive online courses designed by industry experts."}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 text-base bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {clients.map((client, i) => (
                  <Image
                    key={i}
                    src={client}
                    alt={`Student ${i + 1}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Join thousands</span> of learners already enrolled
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card">
                <Image
                  src={data?.layout?.banner?.image?.url || "/assests/hero-banner.png"}
                  width={600}
                  height={400}
                  alt="Learning Platform"
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button
            onClick={handleExploreCourses}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Explore All Courses</span>
            <FiPlay className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;