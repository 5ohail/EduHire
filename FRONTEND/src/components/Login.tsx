// import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MyContext } from "../context/context";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(MyContext);
  if(!context) console.error("context is undefined");
  const {setDesignation,setUser,setIsLoggedIn} = context;

  const API_URL = "http://localhost:5000/api/auth/login"; // Replace with your actual backend login URL
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents default form reload
    setIsLoading(true);

    try {
      // API Call to the MERN Backend's login route
      const response = await axios.post(API_URL, { email, password });
      console.log(response.data);
      // Check for success and JWT token presence
      if (response.data.token) {
        // Store JWT under the unified key used by the app
        localStorage.setItem("token", response.data.token);
        // Persist user data (optional)
        try { localStorage.setItem("userData", JSON.stringify(response.data.data)); } catch {}

        toast.success("Login successful! Welcome back.");

        // Update context from backend shape { success, data, token }
        const user = response.data.data;
        setDesignation(() => (user ? user.role : "student"));
        setUser(() => (user ? user.name : ""));
        setIsLoggedIn(true);
        navigate("/"); 

      } else {
        // This case is unlikely if the backend is configured correctly
        toast.error("Login failed. Invalid response from server.");
      }
    } catch (error : any) {
      console.error("Login error:", error.response?.data || error.message);
      // Display the error message sent from the backend (e.g., "Invalid credentials")
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
     

    }
  };


  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        className="border rounded p-2 border-gray-400 outline-none"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        // disabled={isLoading}
      />
      <input
        type="password"
        className="border rounded p-2 border-gray-400 outline-none"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        // disabled={isLoading}
      />

      <button
        type="submit"
        onClick={(e: never) => handleSubmit(e)}
        // disabled={isLoading}
        className={`rounded text-white font-semibold p-2 transition ${
          false ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {false ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
