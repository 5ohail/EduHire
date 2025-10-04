import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoutes";
import Internship from "./pages/Internship";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import LogManagement from "./pages/LogManagement";
import Settings from "./pages/Settings";
import FilteredInternshipsList from "./pages/FilteredInternshipsList";
import ListedInternshipDetails from "./pages/ListedInternshipDetails";
import PlacementCellOpening from "./pages/PlacementCellOpening";
import Calendar from "./pages/Calendar";
import PlacementAnalyticBoard from "./pages/PlacementAnalyticBoard";
import PlacementFeedbackManager from "./pages/Feedback";
import Students from "./pages/Students";
import NotFoundPage from "./pages/NotFound";
const App = () => {
  const isAuthenticated = true; // TODO: replace with real auth logic (context, localStorage, API)

  return (
    <div>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Authentication />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/internships" element={<Internship />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logs" element={<LogManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/filtered-internships" element={<FilteredInternshipsList />} />
        <Route path="/view" element={<ListedInternshipDetails />} />
        <Route path="openings" element={<PlacementCellOpening />} />
        <Route path="applications/:id" element={<Applications />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="analytics" element={<PlacementAnalyticBoard />} />
        <Route path="feedback" element={<PlacementFeedbackManager />} />
        <Route path="students" element={<Students />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
