"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
    const router = useRouter();
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found, redirecting to home page");
        router.push("/");
    }   
    return (
        <div>Dashboard</div>
    )
}

export default Dashboard