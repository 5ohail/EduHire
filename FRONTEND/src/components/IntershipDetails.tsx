import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Preferences {
  location: string;
  type: string;
  duration: string;
  skills: string[];
  sectors: string[];
}

const allSkills = [
  "JavaScript", "Python", "React", "Node.js", "CSS", "HTML",
  "Django", "Flask", "C++", "Java", "TypeScript", "SQL", "NoSQL",
  "ML", "AI", "AWS", "Docker", "Kubernetes"
];

const allSectors = [
  "Tech", "Finance", "Healthcare", "Education", "Marketing",
  "Design", "Sales", "Human Resources", "Operations", "Customer Service",
  "Research", "Energy", "Government", "Non-Profit", "Telecom", "Manufacturing"
];

const buttonStyle = "px-4 py-2 rounded-full border text-sm transition-all duration-200";
const activeStyle = "bg-blue-100 border-blue-500 text-blue-600";
const inactiveStyle = "bg-gray-100 text-gray-600 border-gray-200";

const InternshipDetails = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Anywhere");
  const [type, setType] = useState("Any");
  const [duration, setDuration] = useState("Any");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelection = (item: string, list: string[], setList: (arr: string[]) => void) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };
const handleFindInternship = async () => {
  setLoading(true);
  try {
    const preferences: Preferences = {
      location,
      type,
      duration,
      skills: selectedSkills,
      sectors: selectedSectors,
    };

    localStorage.setItem("internshipPreferences", JSON.stringify(preferences));
    navigate("/filtered-internships");
  } catch (err) {
    console.error(err);
    alert("Failed to save preferences.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-[#f7fafd] min-h-screen py-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800">Find Your Perfect Internship</h1>

      {/* Preferences */}
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-lg bg-white mt-6 shadow-sm">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">Preferences</h2>

        {/* Location, Type, Duration */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Location</h3>
            <div className="flex gap-3 flex-wrap">
              {["Anywhere", "Home", "Remote"].map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`${buttonStyle} ${location === loc ? activeStyle : inactiveStyle}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold mb-2">Internship Type</h3>
            <div className="flex gap-3 flex-wrap">
              {["Any", "Online", "Offline", "Hybrid"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`${buttonStyle} ${type === t ? activeStyle : inactiveStyle}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold mb-2">Duration</h3>
            <div className="flex gap-3 flex-wrap">
              {["Any", "Short-term", "Long-term"].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`${buttonStyle} ${duration === d ? activeStyle : inactiveStyle}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {allSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                className={`${buttonStyle} ${selectedSkills.includes(skill) ? activeStyle : inactiveStyle}`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <div>
          <h3 className="font-semibold mb-2">Sectors</h3>
          <div className="flex flex-wrap gap-3">
            {allSectors.map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => toggleSelection(sec, selectedSectors, setSelectedSectors)}
                className={`${buttonStyle} ${selectedSectors.includes(sec) ? activeStyle : inactiveStyle}`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-600 transition-all disabled:opacity-60"
          onClick={handleFindInternship}
          disabled={loading}
        >
          {loading ? "Fetching internships..." : "Find My Internship"}
        </button>
      </div>
    </div>
  );
};

export default InternshipDetails;
