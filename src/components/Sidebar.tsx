import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faBed,
  faUsers,
  faNewspaper,
  faUser,
  faBalanceScale,
  faBoxOpen,
  faParking,
  faInfoCircle,
  faSignOutAlt,
  faFileContract,
  faGavel,
  faCaretDown,
  faCaretRight,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

interface Sidebar {
  onSidebarToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<Sidebar> = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "user"; 
  
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onSidebarToggle(newState);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-1 px-3 fixed top-4 left-2 z-50 shadow-lg focus:outline-none bg-white text-[#5F25EB]"
      >
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} size="sm" />
      </button>

      {/* Sidebar */}
      <aside
        className={`h-full w-64 bg-gray-800 text-white fixed top-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg overflow-hidden`}
      >
        <Link to="/dashboard" className="text-white hover:underline">
          <div className="p-4 text-lg font-bold border-b border-gray-700 text-center">
            Homefull Admin
          </div>
        </Link>

        <nav className="p-4">
  <ul className="space-y-2">
    {/* Show Reservations and Logout for Manager */}
    {userRole === "manager" ? (
      <>
        <li>
          <Link
            to="/reservation"
            className="flex items-center p-2 text-sm rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
          >
            <FontAwesomeIcon icon={faClipboardCheck} className="mr-3" />
            Reservations
          </Link>
        </li>
        {/* <li>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-sm rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            Logout
          </button>
        </li> */}
      </>
    ) : (
      /* Render all other items for non-manager users */
      <>
        {[
          { path: "/shelter", label: "Shelters", icon: faBed },
          { path: "/parking", label: "Parking", icon: faParking },
          { path: "/reservation", label: "Reservations", icon: faClipboardCheck },
          { path: "/news", label: "News", icon: faNewspaper },
          { path: "/user", label: "Users", icon: faUsers },
          { path: "/profile", label: "Profile", icon: faUser },
        ].map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="flex items-center p-2 text-sm rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {item.label}
            </Link>
          </li>
        ))}

        {/* Dropdown Menu */}
        <li>
          <button
            onClick={toggleDropdown}
            className=" flex items-center p-2 w-full text-sm rounded-lg hover:bg-[#5F25EB] focus:bg-[#5F25EB] focus:outline-none"
          >
            <FontAwesomeIcon icon={faBoxOpen} className="mr-3" />
            Resources
            <FontAwesomeIcon
              icon={isDropdownOpen ? faCaretDown : faCaretRight}
              className="ml-auto"
            />
          </button>
          {isDropdownOpen && (
            <ul className="pl-6 mt-1 space-y-1 bg-gray-800 border border-gray-700  z-50 relative">

              {[
                { path: "/resources", label: "Resources", icon: faBoxOpen },
                { path: "/legalhelp", label: "Legal Help", icon: faBalanceScale },
                { path: "/aboutus", label: "About Us", icon: faInfoCircle },
                { path: "/terms", label: "Terms", icon: faFileContract },
                { path: "/evictionhelp", label: "Eviction Help", icon: faGavel },
                { path: "/privacy", label: "Privacy", icon: faInfoCircle },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center p-2 text-sm rounded-lg hover:bg-[#5F25EB]"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </>
    )}
  </ul>
</nav>


        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-sm rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
