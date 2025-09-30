// Layout.tsx
import React from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar"; // make sure the path is correct
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Navbar />
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
