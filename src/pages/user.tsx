import React, { useState } from "react";
import { useUser } from "../context/GlobalContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const User: React.FC = () => {
  const {users, addUser, updateUser, deleteUser } = useUser();
  // State for all fields
  const [useremail, setUseremail] = useState("");
  const [username, setUsername] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [userDOB, setUserDOB] = useState("");
  const [usergender, setUsergender] = useState("");
  const [userimg, setUserimg] = useState<File | null>(null);
  
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };
  const [profileImage] = useState<string>(
     localStorage.getItem("profileImage") || "/default-profile.png"
   );
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (useremail && userpassword && userDOB && usergender && username) {
      let base64Image = null;

      if (userimg) {
        base64Image = await toBase64(userimg); // Convert image to base64
      }

      const newEntry = {
        useremail,
        username,
        userpassword,
        userDOB,
        usergender,
        userimg: base64Image !== null ? base64Image : (editIndex !== null ? users[editIndex].userimg : null),
     
      };

      if (editIndex !== null) {
        updateUser(editIndex, newEntry); // Assuming this function exists in the context for managing users
      } else {
        addUser(newEntry); // Assuming this function exists in the context for managing users
      }

      // Reset form fields after submission
      setUseremail("");
      setUserpassword("");
      setUsername("");
      setUserDOB("");
      setUsergender("");
      setUserimg(null);
      setEditIndex(null); // Reset edit mode
    }
  };

  // Convert file to base64
  const toBase64 = (file: File): Promise<string | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(file);
    });

  // Handle editing of a user entry
  const handleEdit = (index: number) => {
    const entry = users[index];
    setUseremail(entry.useremail);
    setUsername(entry.username);
    setUserpassword(entry.userpassword);
    setUserDOB(entry.userDOB);
    setUsergender(entry.usergender);
    setUserimg(null);
    setEditIndex(index);
  };

   // Show confirmation dialog for delete
   const confirmDelete = (index: number) => {
    setSelectedUserIndex(index);
    setShowConfirmDialog(true);
  };
  // Handle delete action with confirmation
  const handleDeleteConfirm = () => {
    if (selectedUserIndex !== null) {
      deleteUser(selectedUserIndex);
    }
    setShowConfirmDialog(false);
    setSelectedUserIndex(null);
  };

  // Handle cancel delete action
  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setSelectedUserIndex(null);
  };
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
        <h1 className="text-2xl font-bold mb-4">Users</h1>
      </div>

      {/* <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter user name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            value={useremail}
            onChange={(e) => setUseremail(e.target.value)}
            placeholder="Enter user email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={userpassword}
            onChange={(e) => setUserpassword(e.target.value)}
            placeholder="Enter user password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={userDOB}
            onChange={(e) => setUserDOB(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select
            value={usergender}
            onChange={(e) => setUsergender(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
          <input
            type="file"
            onChange={(e) => setUserimg(e.target.files ? e.target.files[0] : null)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {editIndex !== null ? "Update User" : "Add User"}
        </button>
      </form> */}

      <div>
        {users.length === 0 ? (
          <p className="text-gray-500">No user entries yet.</p>
        ) : (
          <ul>
            {users.map((entry, index) => (
              <li key={index} className="mb-4 border-b pb-4 p-4 hover:bg-gray-200">
                <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">{entry.username}</h3>
                  <h3 className="text-lg font-bold">{entry.useremail}</h3>
                  {entry.userimg && (
                    <img
                      src={entry.userimg}
                      alt={entry.useremail}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <p><strong>Date of Birth:</strong> {entry.userDOB}</p>
                  <p><strong>Gender:</strong> {entry.usergender}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default User;
