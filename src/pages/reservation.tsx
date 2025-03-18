// import React, { useState, useEffect } from "react";
// import { fetchReservations } from "../API/reservations";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";

// const Reservation: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [shelterReservations, setShelterReservations] = useState<any[]>([]);
//   const [parkingReservations, setParkingReservations] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const handleSidebarToggle = (isOpen: boolean) => {
//     setIsSidebarOpen(isOpen);
//   };

//   const [profileImage] = useState<string>(
//     localStorage.getItem("profileImage") || "/default-profile.png"
//   );
//   const [adminName] = useState<string>(
//     localStorage.getItem("adminName") || "John Doe"
//   );

//   useEffect(() => {
//     const getReservations = async () => {
//       try {
//         const data = await fetchReservations();
//         setShelterReservations(data.shelter_reservations);
//         setParkingReservations(data.parking_reservations);
//         console.log("Shelter Reservations:", data.shelter_reservations);
//         console.log("Parking Reservations:", data.parking_reservations);
//       } catch (error) {
//         console.error("Failed to load reservations", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getReservations();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   const renderTable = (reservations: any[]) => {
//     if (reservations.length === 0) return <p>No reservations available.</p>;

//     const columns = Object.keys(reservations[0]);

//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 bg-white rounded-lg">
//           <thead>
//             <tr className="bg-gray-200 text-black">
//               {columns.map((col) => (
//                 <th key={col} className="px-4 py-2">
//                   {col.charAt(0).toUpperCase() + col.slice(1)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {reservations.map((reservation, index) => (
//               <tr key={index} className="text-gray-700 border-b hover:bg-gray-100">
//                 {columns.map((col) => (
//                   <td key={col} className="px-4 py-2 text-center">
//                     {reservation[col] ? reservation[col].toString() : "N/A"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar onSidebarToggle={handleSidebarToggle} />

//       {/* Main Content */}
//       <div
//         className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         <Header profileImage={profileImage} userName={adminName} />

//         <main className="p-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Reservations</h1>

//           <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shelter Reservations</h2>
//           {renderTable(shelterReservations)}

//           <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Parking Reservations</h2>
//           {renderTable(parkingReservations)}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Reservation;

import axiosInstance from "../API/axiosInstance";
import React, { useState, useEffect } from "react";
import { fetchReservations } from "../API/reservations";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Release reservation
const releaseReservation = async (reservation_id: number, type: string) => {
  try {
    const token = localStorage.getItem("token");
    await axiosInstance.post("/manager/reservations/release", {
      reservation_id,
      type,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Reservation released successfully!");
  } catch (error) {
    console.error("Error releasing reservation:", error);
    alert("Failed to release reservation.");
  }
};

// Confirm arrival
const confirmArrival = async (reservation_id: number, type: string) => {
  try {
    const token = localStorage.getItem("token");
    await axiosInstance.post("/manager/reservations/arrived", {
      reservation_id,
      type,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Arrival confirmed successfully!");
  } catch (error) {
    console.error("Error confirming arrival:", error);
    alert("Failed to confirm arrival.");
  }
};

const Reservation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shelterReservations, setShelterReservations] = useState<any[]>([]);
  const [parkingReservations, setParkingReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };
  const [profileImage] = useState<string>(
    localStorage.getItem("profileImage") || "/default-profile.png"
  );
  const [adminName] = useState<string>(
    localStorage.getItem("adminName") || "John Doe"
  );
  const assignedShelters = JSON.parse(localStorage.getItem("assignedShelters") || "[]");
  const assignedParkingSpots = JSON.parse(localStorage.getItem("assignedParkingSpots") || "[]");
  const userRole = localStorage.getItem("userRole") || "admin";

  useEffect(() => {
    const getReservations = async () => {
      try {
        const data = await fetchReservations();
        if (userRole === "manager" &&   (assignedShelters.length > 0 || assignedParkingSpots.length > 0)) {
          const filteredShelterReservations = data.shelter_reservations.filter((reservation: any) =>
            assignedShelters.includes(reservation.shelter_id)
          );
          const filteredParkingReservations = data.parking_reservations.filter((reservation: any) =>
            assignedParkingSpots.includes(reservation.parking_spot_id)
          );
          setShelterReservations(filteredShelterReservations);
          setParkingReservations(filteredParkingReservations);
        } else {
          setShelterReservations(data.shelter_reservations);
          setParkingReservations(data.parking_reservations);
        }
        
      } catch (error) {
        console.error("Failed to load reservations", error);
      } finally {
        setLoading(false);
      }
    };
    getReservations();
  }, [assignedShelters, assignedParkingSpots, userRole]);

  if (loading) return <div>Loading...</div>;

  const renderTable = (reservations: any[], type: string) => {
    if (reservations.length === 0) return <p>No reservations available.</p>;
    const columns = Object.keys(reservations[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-black">
              {columns.map((col) => (
                <th key={col} className="px-4 py-2">{col.charAt(0).toUpperCase() + col.slice(1)}</th>
              ))}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index} className="text-gray-700 border-b hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-center">{reservation[col] || "N/A"}</td>
                ))}
                <td className="px-4 flex gap-2 py-2 text-center">
                  <button className="mr-2 bg-blue-500 text-white px-2 py-1 rounded text-xs" onClick={() => confirmArrival(reservation.id, type)}>Arrived</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded " onClick={() => releaseReservation(reservation.id, type)}>Release</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSidebarToggle={handleSidebarToggle} />
      <div className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Header profileImage={profileImage} userName={adminName} />
        <main className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Reservations</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shelter Reservations</h2>
          {renderTable(shelterReservations, "shelter")}
          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Parking Reservations</h2>
          {renderTable(parkingReservations, "parking-spots")}
        </main>
      </div>
    </div>
  );
};

export default Reservation;

