import React, { useEffect, useState } from "react";
import { fetchPages, addPages } from "../API/page"; 
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Resource: React.FC = () => {
    const [adminName] = useState<string>(
           localStorage.getItem("adminName") || "John Doe"
         );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    resources: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileImage] = useState<string>(
    localStorage.getItem("profileImage") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC71DQ4-MmziD-OYefebcWaYZB78NLwclD8A&s"
  );
  const [_, setPage] = useState<any | null>(null);


  useEffect(() => {
    const getPage = async () => {
      try {
        const data = await fetchPages();
        setPage(data[0] || null); // Ensure a single object is set
        setFormData({ resources: data[0]?.resources || "" }); // Pre-fill form with existing data
      } catch (err) {
        setError("Failed to fetch page.");
      } finally {
        setLoading(false);
      }
    };
    getPage();
  }, []);

  // Handle form input changes
  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, resources: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await addPages(formData);
      setSuccessMessage("Page updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 1000);
    } catch (err) {
      setError("Failed to update page.");

    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      <div className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <Header profileImage={profileImage} userName={adminName} />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Resources</h1>
          
      
          {/* Form to Edit About Us */}
          <form onSubmit={handleSubmit}>
            <ReactQuill
              value={formData.resources}
              onChange={handleChange}
              placeholder="Write resources ..."
            />
             {/* Success Message */}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <button  className="mt-4 px-4 py-2 bg-[#5F25EB]  text-white " type="submit">Update</button>
          
          </form>

         

          
          {/* Display Updated About Us Content */}
          {/* <h3 className="mt-6 text-2xl font-bold">Current Resources</h3>
          <div className="border p-4 bg-gray-50 mt-2 rounded-md">
            {page?.resources ? (
              <div dangerouslySetInnerHTML={{ __html: page.resources }} />
            ) : (
              <p>No content available.</p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Resource;
