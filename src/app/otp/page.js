import { Button } from "@/components/ui/button";
import Image from 'next/image';
import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";


export default function Otp() {
    return (
      <main className="bg-black h-screen flex items-center justify-center">
        <div className="box-animate bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col relative" style={{ backgroundImage: "url('/assets/loginimg.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
          <div className="absolute inset-0 bg-white opacity-80"></div>
  
          <div className="my-12 mx-12 relative z-10">
            <h1 className="font-bold text-2xl flex items-center justify-center">Enter your Code</h1>
            <p className="text-xs mb-4 flex justify-center items-center mt-2">We sent a code to abc***@gmail.com</p>
            <div>
              <InputOTP maxLength={4}>
                <InputOTPGroup className="border border-black"  >
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="border border-black" >
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
  
            <p className="text-xs mb-4 flex justify-center items-center ">Dont receive the code?<strong>Click to resend</strong></p>
  
  
            <Button type='submit' className="w-full mt-4 bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]">
              Continue
            </Button>
          </div>
        </div>
      </main>
    );
  }
  