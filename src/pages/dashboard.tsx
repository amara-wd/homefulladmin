import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard: React.FC = () => {
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };
  const [profileImage] = useState<string>(
     localStorage.getItem("profileImage") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC71DQ4-MmziD-OYefebcWaYZB78NLwclD8A&s"
   );
   const [adminName] = useState<string>(
       localStorage.getItem("adminName") || "John Doe"
     );
    
    const parkingData = [
      { name: "8 AM", availableSpots: 50 },
      { name: "10 AM", availableSpots: 40 },
      { name: "12 PM", availableSpots: 30 },
      { name: "2 PM", availableSpots: 25 },
      { name: "4 PM", availableSpots: 20 },
      { name: "6 PM", availableSpots: 15 },
      { name: "8 PM", availableSpots: 10 },
    ];
  
    const reservationData = [
      { name: "Mon", reservations: 40 },
      { name: "Tue", reservations: 60 },
      { name: "Wed", reservations: 75 },
      { name: "Thu", reservations: 90 },
      { name: "Fri", reservations: 110 },
    ];
  
    const pieData = [
      { name: "Occupied", value: 80 },
      { name: "Available", value: 20 },
    ];
  
    const COLORS = ["#5F25EB", "#23A055"];
   
  
  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar onSidebarToggle={handleSidebarToggle} />
  
    {/* Main Content */}
    <div
      className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
        isSidebarOpen ? "ml-64" : "ml-0"
      }`}
    >
      <Header profileImage={profileImage} userName={adminName} />
  
      <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        {/* <div className="p-4 bg-blue-50 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-700">Quick Stats</h2>
          <ul className="mt-2 text-gray-600 space-y-2">
            <li>Total Users: <span className="font-medium text-blue-800">1,245</span></li>
            <li>Total Reservations: <span className="font-medium text-blue-800">320</span></li>
            <li>Available Beds: <span className="font-medium text-blue-800">57</span></li>
          </ul>
        </div> */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Line Chart */}
        <Link to="/parking">
        <div className="p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Parking Availability</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={parkingData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="availableSpots" stroke="#5F25EB" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </Link>

        {/* Bar Chart */}
        <Link to="/shelter">
        <div className="p-4 bg-white shadow-lg rounded-xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Daily Reservations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reservations" fill="#23A055" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </Link>
      </div>

      {/* Pie Chart */}
      <Link to="/shelter">
      <div className="p-4 bg-white shadow-lg rounded-xl mt-8 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Bed Occupancy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
            {pieData.map((_, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}

            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </Link>
    </main>

    </div>
    
  </div>
  
  );
};

export default Dashboard;
