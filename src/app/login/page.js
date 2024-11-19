"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image"; // Correct import for Next.js Image component

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Enable the button only if both email and password fields are not empty
  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  const onLogin = async (e) => {
    e.preventDefault();
    if (buttonDisabled) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/users/login",
        user,
        { withCredentials: true } // Ensure cookies are sent with the request
      );

      // Redirect to home page or another page upon successful login
      console.log("Login Successful:", response.data);
      toast.success("Login successful!");
      router.push("/home"); // Redirect after login
    } catch (error) {
      console.error("Login Failed:", error);
      toast.error(
        error.response?.data?.error || "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#E9ECEF] h-screen flex items-center justify-center p-10 mt-9">
      <div className="box3-animate grid w-[60%] h-auto grid-cols-1 bg-[#1b1b1b] md:grid-cols-2">
        <div className="bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="font-bold text-2xl">WELCOME!</h1>
            <h2 className="font-semibold text-xl text-black mt-1 flex items-center justify-center text-center">
              {loading ? "Processing..." : "Candidates Login"}
            </h2>
          </div>

          <form onSubmit={onLogin}>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter Your Email"
              className="mt-1 mb-1 bg-transparent rounded-xl border border-black"
              required
            />

            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter Your Password"
              className="mt-1 mb-1 bg-transparent rounded-xl border border-black"
              required
            />

            <p className="text-xs flex justify-end items-end">
              <Link href="/forgot-password">Forgot Password?</Link>
            </p>

            <Button
              type="submit"
              className={`w-full mt-2 bg-[#162F65] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b] ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={buttonDisabled || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-xs flex items-center mb-2 justify-center">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 ml-1">
                Sign Up
              </Link>
            </p>

            <Button
              className="flex items-center w-full gap-2 px-10 mb-4 bg-[#162F65] text-[#f5f5f5] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]"
              variant="outline"
              type="button"
            >
              <FcGoogle />
              Sign In with Google
            </Button>
          </form>
        </div>

        <div className="relative hidden md:block">
          <Image
            src="/assets/loginimg.jpg"
            alt="background image"
            layout="fill" // Correct usage for full container fill
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
