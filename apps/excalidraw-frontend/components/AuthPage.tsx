"use client";
import { handleAuth } from "@/functions/handleAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);
  const [errDisplay, setErrDisplay] = useState<string>("");
  const router = useRouter();
  let errorMessage: any = null;
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[rgba(48,148,182,0.95)] to-white">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {!isSignin ? "Sign Up" : "Sign In"}
        </h2>
        
        <div className="space-y-4">
          {!(isSignin) &&
          <>
            <label className="text-black text-md p-1 font-semibold">Name</label> 
            <input
              type="text"
              placeholder="Name"
              onChange = {(e) => {
                setErr(false);
                setName(e.target.value)
              }}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
            />
          </>}
          <label className="text-black text-md p-1 font-semibold">Username</label>
          <input
            type="text"
            placeholder="Email"
            onChange = {(e) => {
              setErr(false);
              setEmail(e.target.value)
            }}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
          />
          <label className="text-black text-md p-1 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange = {(e) => 
              {
                setErr(false);
                setPassword(e.target.value)
              }}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
          />
        </div>

        <button
          onClick={async () => {
            errorMessage = await handleAuth(email, password, isSignin, setErr, name)
            setErrDisplay(errorMessage.msg);
            if (errorMessage.success) {
              router.push("/dashboard");
            }
          }}
          disabled={err}
          className="cursor-pointer w-full mt-4 bg-[rgba(48,148,182,0.95)] text-white py-2 rounded-md hover:bg-[rgba(48,148,182,1)] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isSignin ? "Sign Up" : "Sign In"}
        </button>
        {err && <div className = "text-red-500">{errDisplay}</div>}
        <p className="text-center text-gray-600 mt-4 text-sm">
          {!isSignin ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-[rgba(48,148,182,0.95)] hover:underline cursor-pointer"
            onClick={() => router.push(isSignin ? "/signup" : "/signin")}
          >
            {!isSignin ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
