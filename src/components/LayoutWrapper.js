// src/components/LayoutWrapper.js
'use client';
import { usePathname } from 'next/navigation'; // Use usePathname instead of useRouter
import CandidateNavbar from '@/components/CandidateNavbar';
import HRNavbar from "@/components/HRNavbar";
import React from 'react';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname(); // Get the current path

  // Determine which navbar to show based on the pathname
  let NavbarComponent = null;
  if (pathname?.startsWith('/HR')) {
    NavbarComponent = HRNavbar;
  } else{
    NavbarComponent = CandidateNavbar;
  }

  return (
    <>
      {/* Conditionally render the navbar */}
      {NavbarComponent && <NavbarComponent />}
      {children}
    </>
  );
}
