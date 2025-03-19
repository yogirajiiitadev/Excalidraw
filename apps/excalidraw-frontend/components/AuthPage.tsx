"use client";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-blue-800 to-blue-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {!isSignin ? "Sign Up" : "Sign In"}
        </h2>
        
        <div className="space-y-4">
          {!(isSignin) && <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />}

          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => {}}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {!isSignin ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          {!isSignin ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push(isSignin ? "/signup" : "/signin")}
          >
            {!isSignin ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
