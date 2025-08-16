"use client";
import { handleAuth } from "@/functions/handleAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [errDisplay, setErrDisplay] = useState("");
  const [errorMessage, setErrorMessage] = useState<{ success: boolean; msg: string } | null>(null);

  const router = useRouter();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[rgba(48,148,182,0.95)] to-white">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>

        <div className="space-y-4">
          {!isSignin && (
            <>
              <label className="text-black text-md p-1 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setErr(false);
                  setName(e.target.value);
                }}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
              />
            </>
          )}

          <label className="text-black text-md p-1 font-semibold">Username</label>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setErr(false);
              setEmail(e.target.value);
            }}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
          />

          <label className="text-black text-md p-1 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setErr(false);
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.95)] focus:border-transparent"
          />
        </div>

        <button
          onClick={async () => {
            const res = await handleAuth(email, password, isSignin, setErr, name);
            setErrorMessage(res);
            setErrDisplay(res.msg);
            if (res.success) {
              router.push("/dashboard");
            }
          }}
          disabled={err}
          className="cursor-pointer w-full mt-4 bg-[rgba(48,148,182,0.95)] text-white py-2 rounded-md hover:bg-[rgba(48,148,182,1)] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>

        {err && <div className="text-red-500">{errDisplay}</div>}

        <p className="text-center text-gray-600 mt-4 text-sm">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-[rgba(48,148,182,0.95)] hover:underline cursor-pointer"
            onClick={() => router.push(isSignin ? "/signup" : "/signin")}
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}
