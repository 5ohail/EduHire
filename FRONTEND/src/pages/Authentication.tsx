import Login from "../components/Login.tsx";
// import { signInWithGoogle, signInWithFacebook } from "../firebase/firebaseConfig.js";
import { Link, /*useNavigate*/ } from "react-router-dom";

const Authentication = () => {
  // const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    // try {
    //   const result = await signInWithGoogle();
    //   navigate("/dashboard");
    // } catch (err) {
    //   console.error("Google login error:", err);
    // }
  };

  const handleFacebookLogin = async () => {
    // try {
    //   const result = await signInWithFacebook();
    //   navigate("/dashboard");
    // } catch (err) {
    //   console.error("Facebook login error:", err);
    // }
  };

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
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            Log in to your Account
          </h2>
          <p className="mt-1 text-gray-600 text-center md:text-left">
            Welcome back! Select method to log in:
          </p>

          {/* OAuth Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6 mt-6">
            <div
              onClick={handleGoogleLogin}
              className="px-10 py-2 rounded border border-gray-400 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <img
                className="h-5 w-5"
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="google"
              />
              Google
            </div>

            <div
              onClick={handleFacebookLogin}
              className="px-10 py-2 rounded border border-gray-400 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <img
                className="h-6 w-6"
                src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
                alt="facebook"
              />
              Facebook
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="h-[1px] bg-gray-300"></div>
            <p className="text-gray-600 text-sm bg-white px-2 absolute left-1/2 -translate-x-1/2 -top-2">
              or continue with email
            </p>
          </div>

          {/* Email Login */}
          <div className="w-full">
            <Login />
          </div>

          {/* Register Link */}
          <div className="flex justify-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 cursor-pointer">
                Sign up
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

export default Authentication;
