import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem("jwt"); 
        toast.success("Logged out successfully! 🍪");

        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1500);
      } else {
        toast.error("Logout failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <nav className="flex items-center justify-between bg-[#28293d] text-white px-6 py-4 shadow-md">
      <img alt="LittleGames" src="/logo.png" className="w-32 h-auto object-contain" />
      <h1 className="text-xl text-white font-bold">Navbar 🖼️⭐🍪</h1>
      <button
        onClick={handleLogout}
        className="loginBtn text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-700 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
