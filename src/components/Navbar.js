'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation'; 
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import axios from 'axios';

export default function Navbar() {
    const router = useRouter(); 

    function NavItem({ path, label }) {
        const isActive = router.pathname === path;
      
        return (
          <li>
            <Link href={path} className={`nav-link ${isActive ? 'active' : ''}`}>
              {label}
            </Link>
            {isActive && <div className="line"></div>}
          </li>
        );
    }

    
    const handleLoginRegister = () => {
        router.push('/login'); 
    };

    // Logout function (if needed)
    // const logout = async () => {
    //     try {
    //         await axios.get('/api/users/logout');
    //         router.push('/login'); // Redirect to login page after logout
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // };

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-4 font-medium bg-white">
            <div className="flex items-center mb-4 md:mb-0">
                <Image
                    className="object-cover rounded-full"
                    src="/assets/loginimg.jpg"
                    alt="background image"
                    width={50}
                    height={50}
                />
                <h1 className="ml-2 font-bold text-xl md:text-2xl lg:text-2xl">ACS</h1>
            </div>
            <nav className="mb-4 md:mb-0">
                <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <NavItem path="/home" label="Home" />
                    <NavItem path="/browsejobs" label="Browse Jobs" />
                    <NavItem path="/aboutus" label="About Us" />
                    <NavItem path="/contact" label="Contact Us" />
                </ul>
            </nav>
            <Button
                type="button" 
                className="w-full md:w-auto bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]"
                onClick={handleLoginRegister} // Add the click handler for login/register
            >
                Login/Register
            </Button>
            <Button
                type="button"
                className="w-full md:w-auto bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]"
                // onClick={logout} 
            >
                Logout
            </Button>
        </header>
    );
}
