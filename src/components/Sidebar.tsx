import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faBed,
  // faHome,
  // faUsers,
  // faBell,
  faNewspaper,
  // faCog,
  faUser,
  faBalanceScale,
  faBoxOpen ,
  faParking,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

interface Sidebar {
  onSidebarToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<Sidebar> = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onSidebarToggle(newState);
  };

  const handleLogout = () => {
    // Clear the authentication token and redirect to login page
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-1 px-3  fixed top-4 left-2 z-50 shadow-lg focus:outline-none bg-white text-[#5F25EB]"
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
            {[ 
              { path: "/shelter", label: "Shelters", icon: faBed },
              { path: "/parking", label: "Parking", icon: faParking },
              { path: "/news", label: "News", icon: faNewspaper },
              { path: "/resources", label: "Resources", icon: faBoxOpen  },
              { path: "/legalhelp", label: "Legal Help", icon: faBalanceScale   },
              { path: "/aboutus", label: "About Us", icon: faInfoCircle  },
              // { path: "/reservation", label: "Reservations", icon: faHome },
              // { path: "/user", label: "Users", icon: faUsers },
              // { path: "/notifications", label: "Notifications", icon: faBell },
           

              { path: "/profile", label: "Profile", icon: faUser  },
              // { path: "/dashboard", label: "Settings", icon: faCog },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-2  rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
       
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg hover:bg-[#5F25EB] focus:bg-[#3A1A82]"
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
