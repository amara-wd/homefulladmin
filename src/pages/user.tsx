import React, { useState, useEffect } from "react";
import { fetchUsers, updateUsers } from "../API/users";
import { fetchShelters } from "../API/shelter";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const roles = ["admin", "user", "manager"];

const User: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [selectedShelters, setSelectedShelters] = useState<{ [key: number]: any[] }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage] = useState<string>(
    localStorage.getItem("profileImage") || "/default-profile.png"
  );
  const [adminName] = useState<string>(
    localStorage.getItem("adminName") || "John Doe"
  );

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

  const handleRoleChange = (index: number, newRole: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) => (i === index ? { ...user, role: newRole } : user))
    );
  };

  const openShelterSelection = (index: number) => {
    setSelectedUserIndex(index);
  };

  const handleShelterSelect = (shelter: any) => {
    if (selectedUserIndex === null) return;

    setSelectedShelters((prev) => {
      const userShelters = prev[selectedUserIndex] || [];
      const alreadySelected = userShelters.some((s) => s.id === shelter.id);
      if (alreadySelected) {
        return {
          ...prev,
          [selectedUserIndex]: userShelters.filter((s) => s.id !== shelter.id),
        };
      } else {
        return {
          ...prev,
          [selectedUserIndex]: [...userShelters, shelter],
        };
      }
    });
  };

  const updateUser = async (index: number) => {
    const user = users[index];
    const assignedShelters = selectedShelters[index] || [];
    try {
      await updateUsers(user.id, { ...user, shelters: assignedShelters });
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      <div className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header profileImage={profileImage} userName={adminName} />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Permission</th>
                  <th className="py-2 px-4 border">Assigned Shelter</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border">
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(index, e.target.value)}
                        className="border p-1"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 border">
                      {user.role === "manager" ? (
                        <button
                          onClick={() => openShelterSelection(index)}
                          className="bg-[#5F25EB] text-white px-2 py-2 rounded"
                        >
                          Assign Shelter
                        </button>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      {selectedShelters[index] && selectedShelters[index].length > 0
                        ? selectedShelters[index]
                            .map((shelter) => `${shelter.id} - ${shelter.name}`)
                            .join(", ")
                        : "None"}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => updateUser(index)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {/* Shelter Selection Modal */}
           {selectedUserIndex !== null && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-3">Select Shelters</h2>
                <div className="max-h-60 overflow-y-auto">
                  {shelters.map((shelter) => (
                    <label key={shelter.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedShelters[selectedUserIndex]?.some(
                          (s) => s.id === shelter.id
                        )}
                        onChange={() => handleShelterSelect(shelter)}
                      />
                      <span>{shelter.id} - {shelter.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedUserIndex(null)}
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
