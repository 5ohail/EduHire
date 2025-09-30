import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoutes";
import Internship from "./pages/Internship";

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
      </Routes>
    </div>
  );
};

export default App;
