import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  AlertTriangle,
  Search,
  User,
  LogOut,
  Bell
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // dropdown state
  const profileRef = useRef(null); // Ref for the profile button and dropdown container

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <nav className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
          {/* Logo + Home */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-black-900">
                <Link to="/home" style={{ textDecoration: "none" }}>
                  DisasterSafe
                </Link>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200"
                style={{ color: "black" }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Right Side: Emergency + Alerts + Simulation + SOS + Profile */}
          <div className="flex items-center space-x-6 relative">
            <button
              onClick={() => navigate("/emergency")}
              className="flex items-center space-x-1 text-black-700 font-medium hover:text-red-500 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>Emergency Directory</span>
            </button>

            {/* ✅ New Local Alerts Button */}
            <button
              onClick={() => navigate("/livetrack")}
              className="flex items-center space-x-1 text-black-700 font-medium hover:text-red-500 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span>Local Alerts</span>
            </button>

            <select
              onChange={(e) => {
                if (e.target.value === "play") {
                  window.open("/modified-mall-fire.html", "_blank");
                } else if (e.target.value === "simulate") {
                  alert("Your college institution hasn't uploaded blueprint.");
                }
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-white-700 font-medium hover:border-red-500 transition bg-black"
            >
              <option value="">Virtual Simulation</option>
              <option value="play">Play Game</option>
              <option value="simulate">Simulate with College</option>
            </select>


            {/* 🚨 SOS Button */}
            <button
              onClick={() => navigate("/sos")}
              className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition animate-pulse"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              SOS
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 text-black-700 font-medium hover:text-red-500 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-gray rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="flex mb-1 items-center w-full px-4 py-2 text-sm text-black-700 hover:bg-gray-100 gap-2"
                  >
                    <User className="w-4 h-4 text-red-500" />
                    Open Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-black-700 hover:bg-gray-100 gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
