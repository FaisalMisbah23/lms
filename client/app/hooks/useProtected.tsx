"use client"
import React from "react";
import UserAuth from "./userAuth";
import { redirect } from "next/navigation";

export default function Protected({ children }: { children: React.ReactNode }) {
    const isAuthenticated = UserAuth();

    return isAuthenticated ? <>{children}</> : redirect("/");
}
