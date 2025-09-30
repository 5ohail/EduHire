import { useState } from "react";

const IntershipDetails = () => {
  const skills = [
    "JavaScript", "Python", "React", "Node.js", "CSS", "HTML",
    "Django", "Flask", "C++", "Java",
  ];

  const sector = [
    "Tech", "Finance", "Healthcare", "Education", "Marketing",
    "Design", "Sales", "Human Resources", "Operations", "Customer Service",
  ];

  const buttonStyle =
    "px-4 py-2 rounded-full border text-sm transition-all duration-200";
  const activeStyle = "bg-blue-100 border-blue-500 text-blue-600";
  const inactiveStyle = "bg-gray-100 text-gray-600 border-gray-200";

  const [location, setLocation] = useState("Home");
  const [type, setType] = useState("Offline");
  const [duration, setDuration] = useState("Long-term");

  return (
    <div className="bg-[#f7fafd] min-h-screen py-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Find Your Perfect Internship
      </h1>

      {/* Basic Information */}
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-lg mt-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">
          Basic Information
        </h2>
        <div className="border-b border-b-gray-300 mb-6"></div>
        <form>
          <div className="flex justify-center gap-8 mb-4 items-center">
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Full Name"
                id="name"
                name="name"
                required
                className="w-96 h-11 border rounded-lg border-blue-400 bg-blue-50 text-sm px-3 outline-blue-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="Education" className="text-gray-800 mb-2">
                Education
              </label>
              <select
                name="Education"
                id="Education"
                className="w-96 border rounded-lg border-blue-400 h-11 bg-blue-50 text-sm px-3 outline-blue-500"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>
          <div className=" flex flex-col px-4">
            <label htmlFor="details" className="text-gray-800">
              Course Year and Details
            </label>
            <input
              type="text"
              id="details"
              placeholder="e.g. B.Tech Computer Science, 2nd Year"
              className="w-full border mt-2 outline-blue-500 h-11 px-3 rounded-lg border-blue-400 bg-blue-50 text-sm"
            />
          </div>
        </form>
      </div>

      {/* Skills */}
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-lg bg-white mt-6 shadow-sm">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">Your Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Sector Interests */}
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-lg bg-white mt-6 shadow-sm">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">
          Sector Interests
        </h2>
        <div className="flex flex-wrap gap-3">
          {sector.map((sec, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300"
            >
              {sec}
            </span>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-lg bg-white mt-6 shadow-sm">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">Preferences</h2>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left Section */}
          <div className="flex flex-col gap-6">
            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="flex gap-3 flex-wrap">
                {["Home", "Anywhere", "Remote"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`${buttonStyle} ${
                      location === loc ? activeStyle : inactiveStyle
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Internship Type */}
            <div>
              <h3 className="font-semibold mb-2">Internship Type</h3>
              <div className="flex gap-3 flex-wrap">
                {["Online", "Offline", "Hybrid"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`${buttonStyle} ${
                      type === t ? activeStyle : inactiveStyle
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="font-semibold mb-2">Duration</h3>
              <div className="flex gap-3 flex-wrap">
                {["Short-term", "Long-term"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`${buttonStyle} ${
                      duration === d ? activeStyle : inactiveStyle
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-blue-50 rounded-xl flex flex-col items-center justify-center px-8 py-10">
            <div className="text-blue-500 text-3xl">✨</div>
            <h4 className="font-semibold mt-3">Step–by–step guidance</h4>
            <p className="text-gray-500 text-sm text-center">
              We’ll guide you through each section.
            </p>
          </div>
        </div>
      </div>

      {/* Final Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-blue-500 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-600 transition-all">
          Find My Internship
        </button>
      </div>
    </div>
  );
};

export default IntershipDetails;
