import React from "react";
import { Link } from "react-router-dom";
interface HeaderProps {
  profileImage: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ profileImage ,userName}) => {
  return (
    <header className="h-16 bg-[#5F25EB] text-white shadow-md flex justify-between items-center px-6">
      {/* Left Section - Search Bar */}
      <div className="flex items-center space-x-4 w-[20%] "></div>

      {/* Right Section - Notifications and User Profile */}
      <div className="flex items-center space-x-6">
        {/* <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 text-gray-700 rounded-lg outline-none bg-white placeholder-gray-500 focus:ring-2 focus:ring-[#4B23A0]"
        /> */}
        {/* Notifications Icon */}
        {/* <button
          title="Notifications"
          className="relative text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.486-1.356-4.674-3.5-5.74V4a1.5 1.5 0 00-3 0v1.26C7.356 6.326 6 8.514 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
            />
          </svg>
       
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button> */}

        {/* User Profile */}
        <Link to="/profile">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={profileImage}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-medium">{userName}</span>
        </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
