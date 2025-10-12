import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/auth/register"; // Backend register URL

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, { email, username, password, role: "Student" });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data)); // optional

        toast.success("Registration successful! Welcome.");
        navigate("/"); // Redirect to dashboard
      } else {
        toast.error("Registration failed. Invalid response from server.");
      }
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border rounded p-2 border-gray-400 outline-none"
        placeholder="Username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="email"
        className="border rounded p-2 border-gray-400 outline-none"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="password"
        className="border rounded p-2 border-gray-400 outline-none"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <button
        type="submit"
        className={`rounded text-white font-semibold p-2 transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Login;
