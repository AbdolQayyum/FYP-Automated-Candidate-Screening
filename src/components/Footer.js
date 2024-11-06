import React from 'react';
import { PhoneIcon, GlobeAltIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/solid'; // Updated for Heroicons v2

const Footer = () => {
    return (
        <footer className="bg-[#F7F8FC] py-8"> {/* Slightly off-white background */}
            <div className="container mx-auto flex flex-wrap justify-between px-4 text-sm">
                {/* Logo Section */}
                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                    <img src="/assets/loginimg.jpg" alt="ACS" className="h-8 mb-2" />
                    <p className="text-[#000080] font-bold">ACS</p> {/* Navy blue text */}
                </div>

                {/* Services Section */}
                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                    <h2 className="font-semibold text-[#000080] mb-2">Services</h2> {/* Navy blue headings */}
                    <ul className="text-gray-600 space-y-1">
                        <li className="hover:text-[#F5D547] cursor-pointer">Browse Jobs</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Companies</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Candidates</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Pricing</li>
                    </ul>
                </div>

                {/* Company Section */}
                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                    <h2 className="font-semibold text-[#000080] mb-2">Company</h2>
                    <ul className="text-gray-600 space-y-1">
                        <li className="hover:text-[#F5D547] cursor-pointer">About us</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Blogs</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">FAQ’s</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Contact</li>
                    </ul>
                </div>

                {/* Support Section */}
                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                    <h2 className="font-semibold text-[#000080] mb-2">Support</h2>
                    <ul className="text-gray-600 space-y-1">
                        <li className="hover:text-[#F5D547] cursor-pointer">Terms of use</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Terms & conditions</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Privacy</li>
                        <li className="hover:text-[#F5D547] cursor-pointer">Cookie policy</li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className="w-full md:w-1/4">
                    <h2 className="font-semibold text-[#000080] mb-2">Newsletter</h2>
                    <p className="text-gray-600 mb-2">Join & get important news regularly</p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#000080]"
                        />
                        <button type="submit" className="bg-[#000080] text-white px-2 rounded-r-md hover:bg-[#F5D547] hover:text-[#000080] transition-colors duration-300">
                            Send
                        </button>
                    </form>
                    <p className="text-xs mt-2 text-gray-500">We only send interesting and relevant emails.</p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-4 px-4 text-center md:text-left">
                <div className="text-gray-600 text-xs mb-2 md:mb-0">
                    <p className="hover:text-[#F5D547] cursor-pointer">Privacy & Terms</p>
                    <p>Contact Us</p>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-2">
                    <a href="#" className="text-gray-400 hover:text-[#F5D547]">
                        <PhoneIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#F5D547]">
                        <GlobeAltIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#F5D547]">
                        <EnvelopeIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#F5D547]">
                        <UserCircleIcon className="h-6 w-6" />
                    </a>
                </div>
            </div>

            <div className="container mx-auto mt-2 text-center">
                <p className="text-gray-600 text-xs">© 2023 jobi inc. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
