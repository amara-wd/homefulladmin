import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const Notifications: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };
  const [profileImage] = useState<string>(
    localStorage.getItem("profileImage") || "/default-profile.png"
  );


  return (
    <div className="flex h-screen bg-gray-100 ">
    <Sidebar onSidebarToggle={handleSidebarToggle} />
    <div
        className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
      
      <Header profileImage={profileImage} />
        <div  className="p-4">
      <div className="flex gap-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
   
  
      </div>

    
      </div>
    </div>
    </div>
  );
};

export default Notifications;
