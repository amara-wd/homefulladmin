import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Profile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Store the saved name and image
  const [adminName, setAdminName] = useState<string>(
    localStorage.getItem("adminName") || "John Doe"
  );
  const [profileImage, setProfileImage] = useState<string>(
    localStorage.getItem("profileImage") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC71DQ4-MmziD-OYefebcWaYZB78NLwclD8A&s"
  );

  // Temporary states for unsaved changes
  const [tempName, setTempName] = useState<string>(adminName);
  const [tempImage, setTempImage] = useState<string>(profileImage);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setTempImage(e.target.result.toString()); // Update temp image
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    setLoading(true);
    setTimeout(() => {
      // Save temp values to actual state & localStorage
      setAdminName(tempName);
      setProfileImage(tempImage);
      
      localStorage.setItem("adminName", tempName);
      localStorage.setItem("profileImage", tempImage);
      
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onSidebarToggle={handleSidebarToggle} />
      <div
        className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-lg  overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header profileImage={profileImage} userName={adminName} />

        <div className="p-8  mx-auto">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Setting</h1>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Admin Profile</h2>

            <div className="flex items-center gap-8 mb-8">
              <div className="relative">
                <img
                  src={tempImage}
                  alt="Admin Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#5F25EB] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => document.getElementById("profileImage")?.click()}
                />
                <input
                  type="file"
                  id="profileImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Click to upload new profile image</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className=" px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200 ease-in-out"
              />
            </div>

            <div className="mt-8">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className={`px-6 py-2  text-white focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-300 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#5F25EB] hover:bg-[#4a1db6]"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
