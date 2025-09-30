// import axios from "axios";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

  const handleSubmit =  () => {
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
