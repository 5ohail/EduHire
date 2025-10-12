import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface InternshipDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  status: 'Applied' | 'Saved' | 'Recommended';
  stipend: string;
  duration: string;
  startDate: string;
  description: string[];
  requirements: string[];
  skills: string[];
  companyLogoUrl: string;
  seatsFilled: number;
  seatsTotal: number;
}

const DetailBadge: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="text-xl text-blue-600 mb-1">{icon}</div>
    <div className="text-xs font-medium text-gray-500">{label}</div>
    <div className="text-base font-semibold text-gray-800">{value}</div>
  </div>
);

const SkillTag: React.FC<{ skill: string }> = ({ skill }) => (
  <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-200 mr-2 mb-2 inline-block">
    {skill}
  </span>
);

const InternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [internship, setInternship] = useState<InternshipDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      setLoading(true);
      try {
        const allInternships = JSON.parse(localStorage.getItem('internships') || '[]');
        const data = allInternships.find((i: InternshipDetail) => i.id === Number(id));
        if (data) setInternship(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load internship details.');
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!internship) return <p className="text-center mt-20">Internship not found.</p>;

  const handleApply = () => {
    if (internship.status !== 'Applied') setInternship({ ...internship, status: 'Applied' });
  };

  const handleSaveToggle = () => {
    const newStatus = internship.status === 'Saved' ? 'Recommended' : 'Saved';
    setInternship({ ...internship, status: newStatus as 'Saved' | 'Recommended' });
  };

  const fillPercent = Math.min(100, (internship.seatsFilled / internship.seatsTotal) * 100);
  const seatsRemaining = internship.seatsTotal - internship.seatsFilled;
  const barColor = fillPercent >= 80 ? 'bg-red-500' : fillPercent >= 50 ? 'bg-yellow-500' : 'bg-green-500';
  const isApplied = internship.status === 'Applied';
  const isSaved = internship.status === 'Saved';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white p-8 rounded-xl shadow-xl mb-8 border-t-8 border-blue-600 flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-500">{internship.company}</p>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{internship.title}</h1>
            <p className="text-lg text-gray-700 font-medium mt-2">{internship.location}</p>
          </div>
          <img src={internship.companyLogoUrl} alt={internship.company} className="w-20 h-20 rounded-xl border border-gray-200 shadow-md flex-shrink-0"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <DetailBadge icon="💰" label="Stipend" value={internship.stipend} />
              <DetailBadge icon="⏱️" label="Duration" value={internship.duration} />
              <DetailBadge icon="🚀" label="Start Date" value={internship.startDate} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 border-b pb-3">Seats Info</h2>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Seats Filled: {internship.seatsFilled}/{internship.seatsTotal}</span>
                <span className={seatsRemaining <= 2 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                  {seatsRemaining} {seatsRemaining === 1 ? 'seat' : 'seats'} left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${fillPercent}%` }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 border-b pb-3">Job Overview</h2>
              <div className="text-gray-700 space-y-4 text-base leading-relaxed">
                {internship.description.map((text, index) => <p key={index}>{text}</p>)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 border-b pb-3">Skills & Technology Stack</h2>
              <div className="flex flex-wrap">{internship.skills.map((s, i) => <SkillTag key={i} skill={s} />)}</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 border-b pb-3">Candidate Requirements</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-3 text-base">
                {internship.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-10 p-6 bg-white border border-blue-200 rounded-xl shadow-lg">
              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`w-full py-3 font-bold rounded-lg text-white text-lg shadow-lg ${isApplied ? 'bg-green-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isApplied ? 'Application Submitted ✅' : 'Apply Now'}
              </button>

              {!isApplied && (
                <button
                  onClick={handleSaveToggle}
                  className={`w-full py-2 font-semibold rounded-lg border text-sm ${isSaved ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-gray-400 text-gray-700 hover:bg-gray-100'}`}
                >
                  {isSaved ? 'Unsave Internship' : 'Save for Later'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;
