"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from 'next/link'

export default function Signup() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault(); // Prevent form from submitting the default way
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup successful. Response:", response.data);
      toast.success("Signup successful!");

      // Redirect to login page after successful signup
      router.push('/login');
    } catch (error) {
      console.error("Signup Failed:", error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <main className="bg-gray-200 min-h-screen flex items-center justify-center p-10 mt-10">
      <div className="box3-animate grid w-4/5 md:w-[60%] h-auto grid-cols-1 md:grid-cols-2 bg-[#162F65] rounded-full">
        {/* Signup Form */}
        <div className="bg-gray-100 text-gray-900 flex flex-col justify-center p-8">
          <div>
            <h1 className="font-bold text-2xl">Join For Success</h1>
            <h2 className="font-semibold text-xl flex items-center justify-center">{loading ? "Processing" : "SignUp"}</h2>
          </div>

          <form className="mt-6" onSubmit={onSignup}>
            {/* Username Input */}
            <Label htmlFor="username" className="block">Username</Label>
            <Input
              type="text"
              id="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Enter username"
              className="mt-1 mb-4 p-2 bg-transparent rounded-xl border border-black custom-input"
            />

            {/* Email Input */}
            <Label htmlFor="email" className="block">Email</Label>
            <Input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter Your Email"
              className="mt-1 mb-4 p-2 bg-transparent rounded-xl border border-black custom-input"
            />

            {/* Password Input */}
            <Label htmlFor="password" className="block">Password</Label>
            <Input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter Your Password"
              className="mt-1 mb-4 p-2 bg-transparent rounded-xl border border-black custom-input"
            />

            {/* Signup Button */}
            <Button type="submit" className="custom-button w-full p-2 rounded-xl border border-black bg-[#162F65] text-gray-100 hover:bg-gray-700" disabled={buttonDisabled}>
              {buttonDisabled ? "SignUp" : "SignUp"}
            </Button>
            <p className="text-xs mt-4 mb-2 text-center">Already have an account? <Link href="/login" className="text-blue-600">Login</Link></p>

            {/* Signup with Google Button */}
            <Button className="flex items-center w-full gap-2 p-2 bg-[#162F65] text-gray-100 rounded-xl border border-black hover:bg-gray-700" variant="outline">
              <FcGoogle />
              Sign Up with Google
            </Button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden md:block relative">
          <img
            className="object-cover w-full h-full "
            src="/assets/loginimg.jpg"
            alt="background"
          />
        </div>
      </div>
    </main>
  );
}
