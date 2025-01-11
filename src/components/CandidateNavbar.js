'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';

export default function CandidateNavbar() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isInterviewEnabled, setIsInterviewEnabled] = useState(false); 

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleNotificationPanel = () => {
        setIsNotificationPanelOpen(!isNotificationPanelOpen);
      
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/users/notifications');
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
                }
    
                const result = await response.json();
    
                if (result.success) {
                    setNotificationCount(result.count);
                    setNotifications(result.notifications);
    
                    // Log notification data to the console
                    console.log("Fetched Notifications:", result.notifications);
    
                    const currentTime = new Date();
                    result.notifications.forEach(notification => {
                        // Extract dates from the message string
                        const dateRegex = /from (.+?) to (.+?)\./;
                        const match = notification.message.match(dateRegex);
    
                        if (match) {
                            const startTime = new Date(match[1].trim());
                            const endTime = new Date(match[2].trim());
    
                            // Log the extracted dates
                            console.log(`Start Time: ${startTime}`);
                            console.log(`End Time: ${endTime}`);
    
                            if (currentTime <= endTime) {
                                setIsInterviewEnabled(true);
                            } else {
                                setIsInterviewEnabled(false);
                            }
                        } else {
                            console.error('Failed to parse dates from the message:', notification.message);
                        }
                    });
                } else {
                    console.error('Failed to fetch notifications:', result.message);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error.message);
            }
        };
    
        fetchNotifications();
    }, []);
    
    

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-4 font-medium bg-[#2B4A87] text-[#EFF0F2]">
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

            <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-[#EFF0F2] hover:text-[#E8AF30] focus:outline-none">
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <NavItem path="/home" label="Home" />
                    <NavItem path="/browsejobs" label="Browse Jobs" />
                    <NavItem path="/aboutus" label="About Us" />
                    <NavItem path="/uploadedresumes" label="Uploads" />
                    <NavItem path="/chatbot/interviewbot" label="ChatBot" />
                </ul>
            </nav>

            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex space-y-2 md:space-y-0 md:space-x-4`}>
                <Button
                    type="button"
                    className="w-full md:w-auto bg-[#E8AF30] text-[#1b1b1b] rounded-xl border border-[#162F65] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    onClick={() => router.push('/login')}
                >
                    Login/Register
                </Button>
                <Button
                    type="button"
                    className="w-full md:w-auto bg-[#E8AF30] text-[#1b1b1b] rounded-xl border border-[#162F65] hover:bg-[#EFF0F2] hover:text-[#1b1b1b]"
                    onClick={() => router.push('/')}
                >
                    Logout
                </Button>
            </div>

            <div className="relative mr-4 md:mr-6">
                <button
                    onClick={toggleNotificationPanel}
                    className="relative text-[#EFF0F2] hover:text-[#E8AF30] focus:outline-none"
                >
                    <FiBell size={20} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </button>
            </div>

            <div className={`fixed top-0 right-0 h-full w-96 bg-[#2B4A87] shadow-xl transform transition-transform duration-300 ${
  isNotificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
}`}>
  <div className="flex justify-between items-center p-4 bg-[#162F65] text-white rounded-t-lg">
    <h2 className="text-lg font-bold">Notifications</h2>
    <button onClick={toggleNotificationPanel} className="text-[#EFF0F2] hover:text-[#E8AF30]">
      <FiX size={24} />
    </button>
  </div>
  <div className="p-4 space-y-3">
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="p-3 mb-3 border-l-4 border-[#E8AF30] bg-[#EFF0F2] text-[#1b1b1b] rounded-lg shadow-md"
        >
          <p className="text-sm font-normal">Message: {notification.message}</p>
          <p className="text-sm font-light">Date: {new Date(notification.createdAt).toLocaleString()}</p>
          <p className="text-sm font-light">
            Job Title: {notification.jobTitle || "No Job Title"}
          </p>
          {isInterviewEnabled ? (
            <Link
              href={`/chatbot/interviewbot`}
              className="text-sm font-semibold bg-[#E8AF30] hover:bg-[#162F65] text-white px-4 py-2 rounded-lg block mt-2"
            >
              Start Interview
            </Link>
          ) : (
            <button
              className="text-sm font-semibold bg-gray-400 text-gray-700 px-4 py-2 rounded-lg block mt-2 cursor-not-allowed"
              disabled
            >
              Interview Unavailable
            </button>
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No new notifications.</p>
    )}
  </div>
</div>

        </header>
    );
}

function NavItem({ path, label }) {
    const router = useRouter();
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
