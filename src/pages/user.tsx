import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, assignShelter } from "../API/users";
import { fetchShelters } from "../API/shelter";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const roles = ["user", "manager"];

const User: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage] = useState<string>(localStorage.getItem("profileImage") || "/default-profile.png");
  const [adminName] = useState<string>(localStorage.getItem("adminName") || "John Doe");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getShelters = async () => {
      try {
        const data = await fetchShelters();
        setShelters(data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };
    getShelters();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleShelterSelect = async (shelter: any) => {
    if (!selectedUser) return;
    
    try {
      await assignShelter(selectedUser.id, shelter.id, true);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, assigned_shelter: shelter } : u
        )
      );
      setSelectedUser(null); // Close modal after assignment
    } catch (error) {
      console.error("Error updating shelter assignment:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      <div className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Header profileImage={profileImage} userName={adminName} />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">User ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Assigned Shelter</th>
                  <th className="py-2 px-4 border">Permission</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border">
                    <td className="py-2 px-4 border">{user.id}</td>
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border p-1"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 border">
                      {user.assigned_shelter ? `${user.assigned_shelter.id} - ${user.assigned_shelter.name}` : "None"}
                    </td>
                    <td className="py-2 px-4 border">
                      {user.role === "manager" && (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="bg-[#5F25EB] text-white px-2 py-2 rounded"
                        >
                          Assign Shelter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedUser && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-3">Select Shelter</h2>
                <div className="max-h-60 overflow-y-auto">
                  {shelters.map((shelter) => (
                    <label key={shelter.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name="shelter"
                        checked={selectedUser.assigned_shelter?.id === shelter.id}
                        onChange={() => handleShelterSelect(shelter)}
                      />
                      <span>{shelter.id} - {shelter.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="bg-green-500 text-white px-4 py-2 mt-3 rounded w-full"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
