import Register from "../components/Register.tsx";
// import { signInWithGoogle, signInWithFacebook } from "../firebase/firebaseConfig.js";
import { Link } from "react-router-dom";

const RegisterPage = () => {

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-[60vw] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-6 justify-center md:justify-start">
            <img
              className="w-28 h-20 md:w-40 md:h-28 md:-translate-x-14"
              src="campusConnect.png"
              alt="logo"
            />
            <h1 className="font-semibold text-xl md:text-2xl text-blue-600 md:-translate-x-28">
              EduHire
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4">
            Create a New Account
          </h2>

          {/* Email Login */}
          <div className="w-full">
            <Register/>
          </div>

          {/* Register Link */}
          <div className="flex justify-center mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 cursor-pointer">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Hidden on small screens) */}
      <div className="hidden md:block w-[40vw]">
        <video
          className="w-full h-screen object-cover border-t md:border-t-0 md:border-l border-gray-400"
          src="login video.mp4"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
};

export default RegisterPage;
