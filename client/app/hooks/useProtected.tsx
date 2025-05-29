"use client"
import React from "react";
import userAuth from "./userAuth";
import { redirect } from "next/navigation";

export default function Protected({ children }: { children: React.ReactNode }) {
    const isAuthenticated = userAuth();

    return isAuthenticated ? <>{children}</> : redirect("/");
}
