// ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../context/context";

// interface User {
//   isLoggedIn: boolean;
//   role: string;
// }

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const context = useContext(MyContext);
    if(!context) console.error("CONTEXT NOT FOUND!!!");
    const {user,isLoggedIn,designation}  = context;
    console.log(designation);

  if (!user && !isLoggedIn) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(designation)) {
    // Logged in but role not allowed → redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted → render children (nested routes)
  return <Outlet />;
};

export default ProtectedRoute;
