import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  status: string;
  imageUrl: string;
  seatsFilled: number;
  seatsTotal: number;
  skills: string[];
}

const FilteredInternships: React.FC = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredInternships = async () => {
      setLoading(true);
      try {
        const preferences = JSON.parse(localStorage.getItem("internshipPreferences") || "{}");

        const res = await fetch("http://localhost:8000/scrape_internships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });

        const data = await res.json();

        // Partial match on skills
        const filtered = (data.internships || []).filter((i: any) =>
          !preferences.skills?.length || i.skills.some((skill: string) => preferences.skills.includes(skill))
        );

        // Save filtered internships to localStorage for detail page
        localStorage.setItem("internships", JSON.stringify(filtered));

        setInternships(filtered);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch internships.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredInternships();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading internships...</p>;
  if (internships.length === 0) return <p className="text-center mt-20">No internships match your preferences.</p>;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {internships.map((i, idx) => {
        const fillPercent = Math.min(100, (i.seatsFilled / i.seatsTotal) * 100);
        const seatsRemaining = i.seatsTotal - i.seatsFilled;
        const barColor = fillPercent >= 80 ? "bg-red-500" : fillPercent >= 50 ? "bg-yellow-500" : "bg-green-500";

        return (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-[380px]">
            <img src={i.imageUrl} alt={i.title} className="w-full h-32 object-cover rounded mb-2" />
            <h3 className="font-bold">{i.title}</h3>
            <p className="text-sm text-gray-600">{i.company}</p>
            <p className="text-xs text-gray-500 mb-2">{i.location}</p>
            <p className="text-xs text-gray-500 mb-2">Skills: {i.skills.join(", ")}</p>

            {/* Seats info */}
            <div className="mt-auto mb-2">
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Seats Filled: {i.seatsFilled}/{i.seatsTotal}</span>
                <span className={seatsRemaining <= 2 ? "text-red-500 font-bold" : "text-gray-500"}>
                  {seatsRemaining} {seatsRemaining === 1 ? "seat" : "seats"} left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${fillPercent}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/view/${i.id}`)}
              className="mt-2 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              View Details
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FilteredInternships;
