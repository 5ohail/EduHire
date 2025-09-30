// Navbar.tsx
import { useContext } from "react";
import { FaBell } from "react-icons/fa";
import { MyContext } from "../context/context";
const Navbar = () => {
  const context = useContext(MyContext);
    if (!context) {
    throw new Error("Navbar must be used within a MyContextProvider");
  }
  const { designation } = context;
  return (
    <>
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">{designation === "placement cell" ? "Dashboard" : 
        (designation === "mentor" ? "Faculty Mentor Dashboard" : "Welcome, User👋")}</h2>
      <div className="flex items-center gap-4">
        <button className="relative">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
    </>
  );
};

export default Navbar;
