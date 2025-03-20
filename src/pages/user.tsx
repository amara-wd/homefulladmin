import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, assignShelter } from "../API/users";
import { fetchShelters } from "../API/shelter";
import {fetchParking } from "../API/parking";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const roles = ["user", "manager"];

const User: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [parkings, setParkings] = useState<any[]>([]);
  const [selectedShelters, setSelectedShelters] = useState<any[]>([]);
const [selectedParkings, setSelectedParkings] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage] = useState<string>(localStorage.getItem("profileImage") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC71DQ4-MmziD-OYefebcWaYZB78NLwclD8A&s");
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

  useEffect(() => {
    const getParkings = async () => {
      try {
        const data = await fetchParking();
        setParkings(data);
      } catch (error) {
        console.error("Error fetching Parkings:", error);
      }
    };
    getParkings();
  }, []);
// Shelter checkbox change handler
const handleShelterChange = (shelter: any) => {
  setSelectedShelters((prev) =>
    prev.some((s) => s.id === shelter.id)
      ? prev.filter((s) => s.id !== shelter.id)
      : [...prev, shelter]
  );
};

// Parking checkbox change handler
const handleParkingChange = (parking: any) => {
  setSelectedParkings((prev) =>
    prev.some((p) => p.id === parking.id)
      ? prev.filter((p) => p.id !== parking.id)
      : [...prev, parking]
  );
};

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
  const handleAssignmentSelect = async () => {
    if (!selectedUser) return;
  
    try {
      const shelterIds = selectedShelters.map((s) => s.id);
      const parkingSpotIds = selectedParkings.map((p) => p.id);
  
      await assignShelter(selectedUser.id, shelterIds, parkingSpotIds);
  
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                assigned_shelter: selectedShelters,
                assigned_parking_spot: selectedParkings,
              }
            : u
        )
      );
  
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };
  
  // const handleAssignmentSelect = async (
  //   selectedShelters: any[] = [],
  //   selectedParkingSpots: any[] = []
  // ) => {
  //   if (!selectedUser) return;
  
  //   try {
  //     // Extract IDs from selected shelters and parking spots
  //     const shelterIds = selectedShelters.map(s => s.id);
  //     const parkingSpotIds = selectedParkingSpots.map(p => p.id);
  
  //     await assignShelter(selectedUser.id, shelterIds, parkingSpotIds);
  
  //     // Update local state
  //     setUsers(prevUsers =>
  //       prevUsers.map(u =>
  //         u.id === selectedUser.id
  //           ? {
  //               ...u,
  //               assigned_shelter: selectedShelters,
  //               assigned_parking_spot: selectedParkingSpots,
  //             }
  //           : u
  //       )
  //     );
  
      
  //   } catch (error) {
  //     console.error("Error updating assignment:", error);
  //   }
  // };
  
  

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
                  <th className="py-2 px-4 border">Assigned Parking-spots</th>
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
  {user.assigned_shelter && user.assigned_shelter.length > 0
    ? user.assigned_shelter.map((shelter: any) => `${shelter.id} - ${shelter.name}`).join(", ")
    : "None"}
</td>
             <td className="py-2 px-4 border">
  {user.assigned_parking_spot && user.assigned_parking_spot.length > 0
    ? user.assigned_parking_spot.map((parking: any) => `${parking.id} - ${parking.name}`).join(", ")
    : "None"}
</td>
                    <td className="py-2 px-4 border">
                      {user.role === "manager" && (
                        <div>
                       <button
  onClick={() => setSelectedUser(user)}
  className="bg-[#5F25EB] text-white px-2 py-2 text-xs rounded"
>
  Assign Shelters and Parkingspots
</button>





                      </div>
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
      <h2 className="text-xl font-bold mb-3">Select Assignment</h2>

     {/* Shelter Selection */}
<h3 className="font-semibold">Shelter</h3>
<div className="max-h-60 overflow-y-auto">
  {shelters.map((shelter) => {
    const isChecked = selectedShelters.some((s) => s.id === shelter.id);

    return (
      <label key={shelter.id} className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          name="shelter"
          checked={isChecked}
          onChange={() => handleShelterChange(shelter)}
        />
        <span>{shelter.id} - {shelter.name}</span>
      </label>
    );
  })}
</div>

{/* Parking Spot Selection */}
<h3 className="font-semibold mt-4">Parking Spot</h3>
<div className="max-h-60 overflow-y-auto">
  {parkings.map((parking) => {
    const isChecked = selectedParkings.some((p) => p.id === parking.id);

    return (
      <label key={parking.id} className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          name="parking"
          checked={isChecked}
          onChange={() => handleParkingChange(parking)}
        />
        <span>{parking.id} - {parking.name}</span>
      </label>
    );
  })}
</div>

<button
  onClick={handleAssignmentSelect}
  className="bg-[#5F25EB] text-white px-4 py-2 mt-3 rounded w-full"
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
