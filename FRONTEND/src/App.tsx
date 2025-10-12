import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Internship from "./pages/Internship";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import LogManagement from "./pages/LogManagement";
import Settings from "./pages/Settings";
import FilteredInternshipsList from "./pages/FilteredInternshipsList";
import ListedInternshipDetails from "./pages/ListedInternshipDetails";
import PlacementCellOpening from "./pages/PlacementCellOpening";
import IntershipDetails from "./components/IntershipDetails";
import Calendar from "./pages/Calendar";
import PlacementAnalyticBoard from "./pages/PlacementAnalyticBoard";
import PlacementFeedbackManager from "./pages/Feedback";
import Students from "./pages/Students";
import NotFoundPage from "./pages/NotFound";
import StudentDirectoryPage from "./pages/StudentDirectoryPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import MentorActionsPage from "./pages/MentorActionPage";
import Register from "./pages/Register";

const App = () => {
  // Example user; replace with real auth (Context/Firebase)

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes for logged-in users */}
        <Route element={<ProtectedRoute allowedRoles={["Student", "admin", "mentor"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/internships" element={<Internship />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/filtered-internships" element={<FilteredInternshipsList />} />
          {/* <Route path="/view" element={<ListedInternshipDetails />} /> */}
          <Route path="/jobs/:id" element={<IntershipDetails />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Student"]}/>}>
          <Route path="/logs" element={<LogManagement />} />
          <Route path={"/view"} element={<ListedInternshipDetails/>}/>
        </Route>
        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/analytics" element={<PlacementAnalyticBoard />} />
          <Route path="/feedback" element={<PlacementFeedbackManager />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student-directory" element={<StudentDirectoryPage />} />
          <Route path="/student-directory/:id" element={<StudentDetailPage />} />
          <Route path="/mentor/action/:id" element={<MentorActionsPage />} />
          <Route path="/openings" element={<PlacementCellOpening />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
