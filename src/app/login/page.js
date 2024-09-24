"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Enable the button only if both email and password fields are not empty
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (buttonDisabled) return; // Prevent submission if button is disabled
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login Success", response.data);
      router.push('/home');
    } catch (error) {
      console.log("Login Failed", error);
      toast.error(error.response?.data?.message || error.message);
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
            <h2 className="font-semibold text-xl text-black mt-1 flex items-center justify-center">
              {loading ? "Processing" : "Login"}
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
            />

            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter Your Password"
              className="mt-1 mb-1 bg-transparent rounded-xl border border-black"
            />

            <p className="text-xs flex justify-end items-end">Forget Password?</p>

            <Button
              type="submit"
              className={`w-full mt-2 bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b] ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={buttonDisabled || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-xs flex items-center mb-2 justify-center">
  Don&apos;t have an account? <Link href="/signup">SignUp</Link>
</p>


            <Button
              className="flex items-center w-full gap-2 px-10 mb-4 bg-[#1b1b1b] text-[#f5f5f5] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]"
              variant="outline"
            >
              <FcGoogle />
              Sign In with Google
            </Button>
          </form>
        </div>

        <div className="relative hidden md:block">
          <Image
            className="object-cover"
            fill={true}
            src="/assets/loginimg.jpg"
            alt="background image"
          />
        </div>
      </div>
    </main>
  );
}
