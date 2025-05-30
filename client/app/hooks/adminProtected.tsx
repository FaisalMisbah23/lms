"use client"
import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function Protected({ children }: { children: React.ReactNode }) {
    const { user } = useSelector((state) => state.auth);
    if (user) {
        const isAdmin = user.role === "admin"
        return isAdmin ? <>{children}</> : redirect("/");
    }

}
