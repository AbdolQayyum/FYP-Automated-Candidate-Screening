'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

export default function Navbar() {
    const router = useRouter(); 

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
        router.push('/login'); 
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-4 font-medium bg-[#162F65] text-[#EFF0F2]">
            <div className="flex items-center mb-4 md:mb-0">
                <Image
                    className="object-cover rounded-full"
                    src="/assets/loginimg.jpg"
                    alt="ACS Logo"
                    width={50}
                    height={50}
                />
                <h1 className="ml-2 font-bold text-xl md:text-2xl lg:text-2xl text-[#E8AF30]">ACS</h1>
            </div>
            <nav className="mb-4 md:mb-0">
                <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <NavItem path="/home" label="Home" />
                    <NavItem path="/browsejobs" label="Browse Jobs" />
                    <NavItem path="/aboutus" label="About Us" />
                    <NavItem path="/contact" label="Contact Us" />
                </ul>
            </nav>
            <div className="flex space-x-4">
                <Button
                    type="button" 
                    className="w-full md:w-auto bg-[#E8AF30] text-[#162F65] rounded-xl border border-[#162F65] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    onClick={handleLoginRegister} 
                >
                    Login/Register
                </Button>
                <Button
                    type="button"
                    className="w-full md:w-auto bg-[#E8AF30] text-[#162F65] rounded-xl border border-[#162F65] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    // onClick={logout} 
                >
                    Logout
                </Button>
            </div>
        </header>
    );
}
