import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // No need for PrivateRoute anymore

// Importing the components
import Users from "./pages/user";
import Shelters from "./pages/shelter"; 
import Parking from "./pages/parking";
import News from "./pages/news"; 
import Profile from "./pages/profile"; 
import Notifications from "./pages/notification"; 
import Reservations from "./pages/reservation";
import Shownews from "./pages/showNews";
import NewsDetail from "./components/NewsDetail";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Resource from "./pages/resource"; 
import AboutUs from "./pages/aboutus"; 
import LegalHelp from "./pages/legalhelp";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import EvictionHelp from "./pages/evictionHelp";
// Utility function to handle private routes
const PrivateRoute = ({ element: Component, ...rest }: any) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the user is authenticated

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};


const App: React.FC = () => {
  return (
    <Router>
      <main className="flex-grow bg-gray-50 p-0">
        <Routes>
          {/* Public route (Login Page) */}
          <Route path="/" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/shelter" element={<PrivateRoute element={Shelters} />} />
          <Route path="/parking" element={<PrivateRoute element={Parking} />} />
          <Route path="/user" element={<PrivateRoute element={Users} />} />
          <Route path="/reservation" element={<PrivateRoute element={Reservations} />} />
          <Route path="/news" element={<PrivateRoute element={News} />} />
          <Route path="/resources" element={<PrivateRoute element={Resource} />} />
          <Route path="/notifications" element={<PrivateRoute element={Notifications} />} />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/aboutus" element={<PrivateRoute element={AboutUs} />} />
          <Route path="/legalhelp" element={<PrivateRoute element={LegalHelp} />} />
          <Route path="/privacy" element={<PrivateRoute element={Privacy} />} />
          <Route path="/terms" element={<PrivateRoute element={Terms} />} />
          <Route path="/evictionhelp" element={<PrivateRoute element={EvictionHelp} />} />
          <Route path="/reservation" element={<PrivateRoute element={Reservations} />} />
          {/* <Route
  path="/reservation"
  element={
    <ProtectedRoute>
      <Reservations />
    </ProtectedRoute>
  }
/> */}

          {/* Other routes */}
          <Route path="/showNews" element={<Shownews />} />
          <Route path="/news/:index" element={<NewsDetail />} />

          {/* Catch-all route that redirects to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
