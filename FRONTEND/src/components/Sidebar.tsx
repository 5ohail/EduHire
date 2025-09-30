// Sidebar.tsx
import { useContext } from "react";
import { FaRegCompass, FaRegSun, FaRegUser, FaRegFileAlt, FaRegClipboard, FaChartBar, FaRegCalendarAlt, FaChartPie, FaBriefcase } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../context/context";

const Sidebar = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("Sidebar must be used within a MyContextProvider");
  }

  const { designation } = context;

  const StudentmenuItems = [
    { name: "Dashboard", icon: <FaChartBar />, nav: "/" },
    { name: "Internships", icon: <FaRegClipboard />, nav: "/internships" },
    { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
    { name: "Profile", icon: <FaRegUser />, nav: "/profile" },
  ];

  const PlacementmenuItems = [
    { name: "Dashboard", icon: <FaChartBar />, nav: "/" },
    { name: "Openings", icon: <FaBriefcase />, nav: "/openings" },
    { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
    { name: "Calendar", icon: <FaRegCalendarAlt />, nav: "/calendar" },
    { name: "Analytics", icon: <FaChartPie />, nav: "/analytics" },
  ];

  const MentorMenuItems = [
    { name: "Dashboard", icon: <FaChartBar />, nav: "/" },
    { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
    { name: "Feedback", icon: <FaRegCompass />, nav: "/feedback" },
    { name: "Students", icon: <FaRegUser />, nav: "/students" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const menuToRender =
    designation === "placement cell"
      ? PlacementmenuItems
      : designation === "student"
      ? StudentmenuItems
      : MentorMenuItems;

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">CampusConnect</h1>
        <ul>
          {menuToRender.map((item) => {
            const isActive = location.pathname === item.nav;
            return (
              <li
                key={item.name}
                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-all ${
                  isActive ? "bg-blue-100 text-blue-500 font-semibold" : "hover:bg-blue-50"
                }`}
                onClick={() => navigate(item.nav)}
              >
                {item.icon} <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4">
        <button
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded w-full cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <FaRegSun /> Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
