import React from 'react';

// --- Interface for Props ---
interface SkillBadgeProps {
  skill: string;
  primary?: boolean;
}

interface ProfileCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface JobExperience {
  id: number;
  title: string;
  company: string;
  status: 'Current' | 'Past';
  dates: string;
}

// --- Reusable Component for Skill/Tag Badges ---
const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, primary = false }) => {
  const baseClasses = 'px-3 py-1 rounded text-sm font-medium mr-2 mb-2 inline-block';
  const colorClasses = primary
    ? 'bg-blue-600 text-white' 
    : 'bg-gray-200 text-gray-800'; 
    
  return <div className={`${baseClasses} ${colorClasses}`}>{skill}</div>;
};

// --- Reusable Component for Main Content Cards ---
const ProfileCard: React.FC<ProfileCardProps> = ({ title, children, className = '' }) => {
  const cardClasses = 'p-5 bg-white rounded-lg shadow-sm ' + className;
  const titleClasses = 'text-lg font-semibold mb-4 text-gray-800';

  return (
    <div className={cardClasses}>
      {title && <h3 className={titleClasses}>{title}</h3>}
      {children}
    </div>
  );
};

// --- Mock Navigation Function ---
// In a real application, this would be `Maps('/log-section/' + jobId)`
const navigateToLogSection = (jobId: number, jobTitle: string) => {
    alert(`Navigating to the Log Section for Job ID ${jobId}:\n"${jobTitle}"`);
    // Example: window.location.href = `/jobs/${jobId}/log`;
};

// --- Main Profile Component ---
const StudentProfile: React.FC = () => {
  // Mock Data
  const profileData = {
    name: 'Rohan Patel',
    title: 'Final Year Computer Science Student specializing in AI/ML.',
    college: 'Mumbai Technical University',
    email: 'rohan.patel@email.com',
    phone: '98765 43210',
    skills: ['Python', 'AWS', 'SolidWorks', 'TensorFlow', 'SQL'],
  };

  const jobHistory: JobExperience[] = [
    { id: 101, title: 'AI Research Intern', company: 'InnovateX Solutions', status: 'Current', dates: 'Sept 2025 - Present' },
    { id: 102, title: 'Freelance Web Developer', company: 'Self-Employed', status: 'Current', dates: '2024 - Present' },
    { id: 201, title: 'Data Analysis Intern', company: 'Tech Insights Corp.', status: 'Past', dates: 'June 2024 - Aug 2024' },
    { id: 202, title: 'Summer Volunteer', company: 'Local Tech Hub', status: 'Past', dates: 'May 2023' },
  ];
  
  const currentJobs = jobHistory.filter(job => job.status === 'Current');
  const pastJobs = jobHistory.filter(job => job.status === 'Past');

  return (
    <div className="p-5 max-w-full mx-auto bg-gray-50">
      {/* Outer Grid: Main Content + Right Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        {/* --- LEFT & CENTER COLUMNS (Span 3/4) --- */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* 1. Header & Bio Card (Full Width) */}
          <div className="sm:col-span-2">
            <ProfileCard className="p-6">
              <div className="flex items-center space-x-5">
                <img
                  src="https://images.unsplash.com/photo-1668262738169-cce042b2b19c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Um9oYW4lMjBQYXRlbHxlbnwwfHwwfHx8MA%3D%3D" 
                  alt="Rohan Patel"
                  className="w-24 h-24 rounded-lg object-cover shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-900">{profileData.name}</h2>
                  <p className="text-md font-medium text-gray-600 mb-2">{profileData.title}</p>
                  <p className="text-sm text-gray-500">{profileData.college}</p>
                  <p className="text-sm text-gray-500">Email: {profileData.email}</p>
                </div>
              </div>
            </ProfileCard>
          </div>

          {/* 2. Skills Card (Half Width) */}
          <ProfileCard title="Technical Skills">
            <div className="flex flex-wrap">
              {profileData.skills.map(skill => (
                <SkillBadge key={skill} skill={skill} primary={true} />
              ))}
              <SkillBadge skill="Teamwork" primary={false} />
              <SkillBadge skill="Problem-Solving" primary={false} />
            </div>
          </ProfileCard>

          {/* 3. Education/Projects Card (Half Width) */}
          <ProfileCard title="Education & Key Projects">
            <h4 className="text-base font-semibold text-gray-800">Mumbai Technical University</h4>
            <p className="text-sm text-gray-500 mb-4">B.Tech in Computer Science, Expected Graduation: 2026</p>

            <h4 className="text-base font-semibold text-gray-800 mt-3">Smart Traffic Management System</h4>
            <p className="text-sm text-gray-500">A machine learning project using TensorFlow.</p>
          </ProfileCard>

          {/* 4. Current Jobs/Internships Card (Full Width for prominence) */}
          <div className="sm:col-span-2">
            <ProfileCard title="Current Jobs & Internships (Active)">
              <div className="space-y-4">
                {currentJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="p-3 border border-blue-200 bg-blue-50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-blue-100 transition"
                    onClick={() => navigateToLogSection(job.id, job.title)}
                  >
                    <div>
                      <h4 className="text-base font-semibold text-blue-800">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company} • {job.dates}</p>
                    </div>
                    <button className="text-blue-600 font-medium text-sm flex items-center">
                        Go to Log 
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
              {currentJobs.length === 0 && <p className="text-gray-500 italic">No active engagements.</p>}
            </ProfileCard>
          </div>

          {/* 5. Past Experience Card (Full Width) */}
          <div className="sm:col-span-2">
            <ProfileCard title="Past Experience">
              <div className="space-y-3">
                {pastJobs.map(job => (
                  <div key={job.id} className="pb-3 border-b border-gray-100 last:border-b-0">
                    <h4 className="text-base font-semibold text-gray-800">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} • {job.dates}</p>
                  </div>
                ))}
              </div>
            </ProfileCard>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Span 1/4): Profile Strength & Quick Actions --- */}
        <div className="md:col-span-1">
          <ProfileCard title="Profile Strength">
            {/* Progress Circle Placeholder (75%) */}
            <div className="relative w-32 h-32 mx-auto mb-5">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"/>
                  <circle className="text-blue-600" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="70.675" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">75%</span>
              </div>
            </div>
            
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors mb-4">
              Update Profile
            </button>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-gray-700 font-medium">Employer View</span>
                {/* Toggle Switch Placeholder */}
                <label htmlFor="employer-view" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="employer-view" className="sr-only" defaultChecked />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4 peer-checked:bg-blue-600"></div>
                    </div>
                </label>
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;