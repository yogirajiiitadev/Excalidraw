"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

const CommonFooter = () => {
  const router = useRouter();
  return (
    <div className="bg-[rgb(48,149,182)]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block bg-[rgba(48,148,182,0.95)]">Start your free drawing today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <span onClick={() => router.push("/signup")} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[rgba(48,148,182,0.95)] bg-white hover:bg-blue-50 cursor-pointer">
                Get started
              </span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CommonFooter