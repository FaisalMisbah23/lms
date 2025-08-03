"use client";

import Link from "next/link";
import { FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-muted/20"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center mb-3">
            <FiSearch className="w-5 h-5 text-muted-foreground mr-2" />
            <span className="text-sm font-medium text-foreground">Try searching for what you need</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Use the search bar in the header to find courses, or browse our categories.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/courses"
              className="p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-sm font-medium text-foreground"
            >
              Browse Courses
            </Link>
            <Link
              href="/about"
              className="p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-sm font-medium text-foreground"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              className="p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-sm font-medium text-foreground"
            >
              FAQ
            </Link>
            <Link
              href="/policy"
              className="p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 text-sm font-medium text-foreground"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 