import { useContext } from "react";
import PlacementDashboard from "../components/PlacementDashboard";
import { MyContext } from "../context/context";
import MentorDashboard from "../components/MentorDashboard";
import StudentDashboard from "../components/StudentDashBoard";
import RecruiterDashboard from "../components/RecruiterDashBoard";
const Dashboard = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("Dashboard must be used within a MyContextProvider");
  }
  const { designation } = context;
  const cards = [
    { title: "Unplaced Students", value: 120 },
    { title: "Open Seats", value: 75 },
    { title: "Upcoming Interviews", value: 30 },
  ];
const students = [
    { name: "Sohail Ansari", department: "Computer Science", appliedFor: "Frontend Developer", status: "Applied" },
    { name: "Vinod Gawariya", department: "Computer Science", appliedFor: "Data Analyst", status: "Selected" },
    { name: "Rahul Verma", department: "Mechanical Engineering", appliedFor: "Software Engineer", status: "Rejected" },
    { name: "Yatharth Gour", department: "Artificial Intelligence", appliedFor: "Backend Developer", status: "Applied" },
  ];

  return (
    <>
      {(designation == "placement cell") && ( <PlacementDashboard students={students} cards={cards} /> )}
      {(designation == "mentor") && ( <MentorDashboard /> )}
      {(designation == "Student") && ( <StudentDashboard /> )}
      {(designation == "recruiter") && ( <RecruiterDashboard /> )}
    </>
  );
};

export default Dashboard;
