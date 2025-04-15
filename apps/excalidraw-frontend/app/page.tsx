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

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Shapes className="h-10 w-10 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Scriblio</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/yogirajiiitadev/Excalidraw" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="https://github.com/yogirajiiitadev/Excalidraw" className="text-gray-600 hover:text-gray-900">Docs</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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
              <span className="block text-blue-600">Seamless Collaboration</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create beautiful hand-drawn like diagrams, wireframes, and illustrations. Collaborate in real-time with your team, anywhere.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={() => router.push("/signin")}
                  className="cursor-pointer w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Drawing <Pencil className="h-6 w-6 text-white ml-2" />
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a 
                  href="https://github.com/yogirajiiitadev/Excalidraw"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  <Github className="mr-2 h-5 w-5" /> View on GitHub
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
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
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
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
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
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
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
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

      {/* CTA Section */}
      <CommonFooter />
    </main>
  </div>
  );
}
