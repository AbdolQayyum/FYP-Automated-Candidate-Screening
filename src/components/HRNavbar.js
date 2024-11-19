'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for the hamburger menu

export default function HRNavbar() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function NavItem({ path, label }) {
        const isActive = router.pathname === path;
      
        return (
          <li className="relative">
            <Link href={path} className={`nav-link ${isActive ? 'active' : ''} text-[#EFF0F2] hover:text-[#E8AF30]`}>
              {label}
            </Link>
            {isActive && <div className="line bg-[#E8AF30] h-1 w-full absolute bottom-0 left-0"></div>}
          </li>
        );
    }

    const handleLoginRegister = () => {
        router.push('/HR/hrlogin');
    };

    const handleLogout = () => {
        router.push('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex items-center justify-between px-4 md:px-20 py-4 font-medium bg-[#2B4A87] text-[#EFF0F2]">
            {/* Logo Section */}
            <div className="flex items-center">
                <Image
                    className="object-cover rounded-full"
                    src="/assets/loginimg.jpg"
                    alt="ACS Logo"
                    width={50}
                    height={50}
                />
                <h1 className="ml-2 font-bold text-xl md:text-2xl lg:text-2xl text-[#E8AF30]">ACS</h1>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-[#EFF0F2] hover:text-[#E8AF30] focus:outline-none">
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <NavItem path="/HR/mainHR" label="Home" />
                    <NavItem path="/HR/addjobs" label="Post Jobs" />
                    <NavItem path="/aboutus" label="About Us" />
                </ul>
            </nav>

            {/* Action Buttons */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex space-y-2 md:space-y-0 md:space-x-4`}>
                <Button
                    type="button"
                    className="w-full md:w-auto bg-[#E8AF30] text-[#2B4A87] rounded-xl border border-[#2B4A87] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    onClick={handleLoginRegister}
                >
                    Login/Register
                </Button>
                <Button
                    type="button"
                    className="w-full md:w-auto bg-[#E8AF30] text-[#2B4A87] rounded-xl border border-[#2B4A87] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </header>
    );
}
