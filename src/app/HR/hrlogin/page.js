'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { toast } from "react-hot-toast";
import Link from 'next/link';

export default function HRLogin() {
  const router = useRouter();
  const [hrAdmin, setHRAdmin] = useState({
    username: "",
    key: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Enable the login button only if both fields are filled
  useEffect(() => {
    setButtonDisabled(!(hrAdmin.username && hrAdmin.key));
  }, [hrAdmin]);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // If the button is disabled, do nothing
    if (buttonDisabled) return;

    try {
      setLoading(true); // Start loading

      // Send login request to backend API
      const response = await fetch("/api/hr/hrlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: hrAdmin.username,
          key: hrAdmin.key,
        }),
      });

      const data = await response.json();
      
      // Check if login was successful
      if (response.ok) {
        toast.success("Login successful!");
        router.push('/HR/mainHR'); // Redirect to HR dashboard
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Server error");
      console.error("Login Failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="bg-[#E9ECEF] h-screen flex items-center justify-center p-10 mt-9">
      <div className="box3-animate grid w-[60%] h-auto grid-cols-1 bg-[#1b1b1b] md:grid-cols-2">
        <div className="bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="font-bold text-2xl">HR LOGIN</h1>
            <h2 className="font-semibold text-xl text-black mt-1 flex items-center justify-center text-center">
              {loading ? "Processing..." : "Admin Login"}
            </h2>
          </div>

          <form onSubmit={onLogin}>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={hrAdmin.username}
              onChange={(e) => setHRAdmin({ ...hrAdmin, username: e.target.value })}
              placeholder="Enter Your Username"
              className="mt-1 mb-1 bg-transparent rounded-xl border border-black"
              required // Ensure required fields
            />

            <Label htmlFor="key">Key</Label>
            <Input
              type="password"
              id="key"
              value={hrAdmin.key}
              onChange={(e) => setHRAdmin({ ...hrAdmin, key: e.target.value })}
              placeholder="Enter Your Key"
              className="mt-1 mb-1 bg-transparent rounded-xl border border-black"
              required // Ensure required fields
            />

            <Button
              type="submit"
              className={`w-full mt-2 bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b] ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={buttonDisabled || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-xs flex items-center mb-2 justify-center">
              Back to <Link href="/">Home</Link>
            </p>
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
