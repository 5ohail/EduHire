// Sidebar.tsx
import { useContext, useState } from "react";
import {FaRegCompass, FaRegSun, FaRegUser, FaRegFileAlt, FaRegClipboard,FaChartBar, FaRegCalendarAlt,FaChartPie, FaBriefcase} from "react-icons/fa"; // hollow/regular
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/context";
const Sidebar = () => {
  const context = useContext(MyContext);
    if (!context) {
    throw new Error("Sidebar must be used within a MyContextProvider");
  }
  const { designation } = context;
  const StudentmenuItems = [
  { name: "Dashboard", icon: <FaChartBar />, nav: "/" },      // Solid has no outline version
  { name: "Internships", icon: <FaRegClipboard />, nav: "/internships" },
  { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
  { name: "Profile", icon: <FaRegUser />, nav: "/profile" },
];
  const PlacementmenuItems = [
  { name: "Dashboard", icon: <FaChartBar />, nav: "/" },      // Solid has no outline version
  { name: "Openings", icon: <FaBriefcase/>, nav: "/openings" },
  { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
  {name: "calendar", icon: <FaRegCalendarAlt />, nav: "/calendar" },
  { name: "Analytics", icon: <FaChartPie />, nav: "/analytics" },
];
  const MentorMenuItems = [
    { name: "Dashboard", icon: <FaChartBar />, nav: "/" },
    { name: "Applications", icon: <FaRegFileAlt />, nav: "/applications" },
    { name: "Feedback", icon: <FaRegCompass />, nav: "/feedback" },
    { name: "Students", icon: <FaRegUser />, nav: "/students" },
  ]
    const [activeItem, setActiveItem] = useState("Dashboard");
    const navigate = useNavigate();// Possible values: "student", "placement cell", "mentor"
    const menuToRender = designation === "placement cell" ? PlacementmenuItems : (designation === "student" ? StudentmenuItems : MentorMenuItems);
  return (
    <>
    <div className="w-64 h-screen bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">CampusConnect</h1>
        <ul>
          {menuToRender.map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
                activeItem === item.name ? "bg-blue-100 text-blue-400" : ""
              }`}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.nav);
              }}
            >
              {item.icon} <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded w-full cursor-pointer" 
        onClick={() => { navigate("/settings"); }}>
          <FaRegSun /> Settings
        </button>
      </div>
</div>
    
</>
    
  );
};

export default Sidebar;
