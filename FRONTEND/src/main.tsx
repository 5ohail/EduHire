import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import App from "./App.tsx";
import Layout from "./pages/Layout.tsx";
import { MyContextProvider } from "./context/context.tsx";

const RootWrapper = () => {
  const [designation, setDesignation] = useState("student"); // "student", "placement cell", "mentor"
  const location = useLocation();

  return (
    <MyContextProvider value={{ designation, setDesignation }}>
      {location.pathname === "/login" ? <App /> : <Layout><App /></Layout>}
    </MyContextProvider>
  );
};

const Root = () => (
  <StrictMode>
    <Router>
      <RootWrapper />
    </Router>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<Root />);
