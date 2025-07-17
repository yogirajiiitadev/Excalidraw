"use client";
import Image from "next/image";
import { 
  Pencil, 
  Share2, 
  Users, 
  Shapes, 
  Cloud, 
  Lock,
  ChevronRight,
  Github, 
  Link
} from 'lucide-react';
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useRouter } from "next/navigation";
import CommonFooter from "@/components/CommonFooter";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <nav className="bg-[rgba(0,120,160,0.08)] border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Shapes className="h-10 w-10 text-[rgba(48,148,182,0.95)]" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Scriblio</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/yogirajiiitadev/Excalidraw" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="https://github.com/yogirajiiitadev/Excalidraw" className="text-gray-600 hover:text-gray-900">Docs</a>
              <button className="bg-[rgba(48,148,182,0.95)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(0,191,255,0.6)] transition">
                Open Board
              </button>
          </div>
        </div>
      </div>
    </nav>

    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Virtual Whiteboard for</span>
              <span className="block text-[rgba(0,120,160,0.95)]">Seamless Collaboration</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create beautiful hand-drawn like diagrams, wireframes, and illustrations. Collaborate in real-time with your team, anywhere.
            </p>

            <div className="mt-8 flex flex-col items-center">
              <span className="inline-block bg-[rgba(0,120,160,0.15)] text-[rgba(0,120,160,0.95)] text-sm px-4 py-2 rounded-full font-semibold mb-2">
                ✨ Gen AI Drawing Assistant
              </span>
              <p className="max-w-xl text-gray-500 text-base md:text-lg">
                Describe what you want to draw, and let our AI instantly generate diagrams and sketches from your prompts. Unleash your creativity with the power of generative AI!
              </p>
              
            </div>

            <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row sm:justify-center gap-4">
              <button
                onClick={() => {
                  router.push("/signin")
                  setLoading(true)
                }}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[rgba(48,148,182,0.95)] hover:bg-[rgba(0,120,160,1)] transition md:py-4 md:text-lg md:px-10 shadow cursor-pointer"
                style={{ minWidth: 180 }}
              >
                Start Drawing <Pencil className="h-6 w-6 text-white ml-2" />
              </button>
              <a
                href="https://github.com/yogirajiiitadev/Excalidraw"
                className="flex-1 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-[rgba(0,191,255,0.8)] bg-white hover:bg-gray-100 transition md:py-4 md:text-lg md:px-10 shadow"
                style={{ minWidth: 180 }}
              >
                <Github className="mr-2 h-5 w-5" /> View on GitHub
              </a>
              <button
                onClick={() => router.push("/canvas/0")}
                className="flex-1 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[rgba(48,148,182,0.95)] hover:bg-[rgba(0,120,160,1)] cursor-pointer transition md:py-4 md:text-lg md:px-10 shadow"
                style={{ minWidth: 180 }}
              >
                Try Gen AI Drawing
                <Cloud className="h-6 w-6 text-white ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[rgba(0,191,255,0.04)] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to create and collaborate
            </h2>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[rgba(0,120,160,0.95)] rounded-md shadow-lg">
                      <Pencil className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Intuitive Drawing</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Create professional diagrams with our easy-to-use drawing tools and hand-drawn style.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[rgba(0,120,160,0.95)] rounded-md shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Real-time Collaboration</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Work together with your team in real-time, see changes instantly as they happen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[rgba(0,120,160,0.95)] rounded-md shadow-lg">
                      <Cloud className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">AI-Powered Drawing</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Generate diagrams and sketches from natural language prompts using our Gen AI module.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[rgba(0,120,160,0.95)] rounded-md shadow-lg">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Easy Sharing</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Share your drawings with a simple link, export to various formats instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </main>
    {loading && <Loading comp="Sign In"/>}
  </div>
  );
}
