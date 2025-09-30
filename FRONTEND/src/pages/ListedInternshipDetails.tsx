import React, { useState } from 'react';

// --- INTERFACE DEFINITIONS ---

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
}

// --- MOCK DATA ---
const mockInternship: InternshipDetail = {
    id: 2,
    title: 'Data Science Intern - Advanced Analytics & AI',
    company: 'Data Insights Corp.',
    location: 'Bangalore, India (Hybrid)',
    status: 'Recommended', 
    stipend: '₹35,000 / month',
    duration: '6 Months',
    startDate: 'Nov 1, 2025',
    companyLogoUrl: 'https://placehold.co/100x100/3b82f6/fff?text=DIC',
    description: [
        "Join our Advanced Analytics team to work on real-world data science challenges. You will be responsible for data cleaning, model building, and deploying solutions to production. This role provides hands-on experience with large-scale datasets and cloud infrastructure.",
        "Key projects include predictive modeling for customer churn, optimizing inventory levels using time-series forecasting, and contributing to the open-source machine learning library used internally.",
        "We are looking for self-starters who are passionate about translating data into actionable business insights.",
    ],
    requirements: [
        'Strong proficiency in Python (Pandas, NumPy, Scikit-learn).',
        'Demonstrated familiarity with SQL and database management systems (PostgreSQL/MySQL).',
        'Currently pursuing a B.Tech/M.Tech in CS, Data Science, or a related technical field.',
        'Experience with cloud platforms (AWS, Azure, or GCP) is a plus.',
    ],
    skills: ['Python', 'SQL', 'TensorFlow', 'AWS Sagemaker', 'Machine Learning', 'Data Visualization', 'Time Series'],
};

// --- UTILITY COMPONENTS ---

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

// --- MAIN COMPONENT ---

const InternshipDetailPageV2: React.FC = () => {
    const [internship, setInternship] = useState(mockInternship);

    const handleApply = () => {
        if (internship.status !== 'Applied') {
            alert(`Applying for ${internship.title}...`);
            setInternship(prev => ({ ...prev, status: 'Applied' }));
        }
    };

    const handleSaveToggle = () => {
        const newStatus = internship.status === 'Saved' ? 'Recommended' : 'Saved';
        alert(`${newStatus === 'Saved' ? 'Saved' : 'Unsaved'} internship.`);
        setInternship(prev => ({ ...prev, status: newStatus as 'Saved' | 'Recommended' }));
    };

    // Determine button state and text
    const isApplied = internship.status === 'Applied';
    const isSaved = internship.status === 'Saved';
    
    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Job Title Header and Company Info */}
                <div className="bg-white p-8 rounded-xl shadow-xl mb-8 border-t-8 border-blue-600">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">{internship.company}</p>
                            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{internship.title}</h1>
                            <p className="text-lg text-gray-700 font-medium mt-2 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                {internship.location}
                            </p>
                        </div>
                        <img src={internship.companyLogoUrl} alt={internship.company} className="w-20 h-20 rounded-xl border border-gray-200 shadow-md flex-shrink-0"/>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Details & Requirements (8/12 width) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* 1. Quick Info Badges (Row of Key Metrics) */}
                        <div className="grid grid-cols-3 gap-4">
                            <DetailBadge icon="💰" label="Stipend" value={internship.stipend} />
                            <DetailBadge icon="⏱️" label="Duration" value={internship.duration} />
                            <DetailBadge icon="🚀" label="Start Date" value={internship.startDate} />
                        </div>
                        
                        {/* 2. Job Description */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Job Overview</h2>
                            <div className="text-gray-700 space-y-4 text-base leading-relaxed">
                                {internship.description.map((text, index) => (
                                    <p key={index}>{text}</p>
                                ))}
                            </div>
                        </div>

                        {/* 3. Essential Skills */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Essential Skills & Technology Stack</h2>
                            <div className="flex flex-wrap">
                                {internship.skills.map((skill, index) => (
                                    <SkillTag key={index} skill={skill} />
                                ))}
                            </div>
                        </div>

                        {/* 4. Requirements */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Candidate Requirements</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-3 text-base">
                                {internship.requirements.map((req, index) => (
                                    <li key={index} className="pl-1">{req}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action and Company Card (4/12 width) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* STICKY ACTION CARD */}
                        <div className="sticky top-10 p-6 bg-white border border-blue-200 rounded-xl shadow-lg">
                            <div className="text-sm font-semibold text-gray-600 mb-4 border-b pb-3">
                                Posted by {internship.company} on: Sep 20, 2025
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleApply}
                                    disabled={isApplied}
                                    className={`w-full py-3 font-bold rounded-lg transition-colors text-white text-lg shadow-lg ${
                                        isApplied ? 'bg-green-600 cursor-not-allowed shadow-green-400/50' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-400/50'
                                    }`}
                                >
                                    {isApplied ? 'Application Submitted ✅' : 'Apply Now'}
                                </button>
                                
                                {!isApplied && (
                                    <button 
                                        onClick={handleSaveToggle}
                                        className={`w-full py-2 font-semibold rounded-lg border transition-colors text-sm ${
                                            isSaved ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-gray-400 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {isSaved ? 'Unsave Internship' : 'Save for Later'}
                                    </button>
                                )}
                            </div>
                            
                            {/* Alert for Saved Status */}
                            {isSaved && (
                                <p className="mt-4 text-sm text-center text-yellow-700 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                                    This internship is currently saved to your list.
                                </p>
                            )}
                        </div>

                        {/* Company Contact/Additional Info Card */}
                        <div className="p-6 bg-white rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">About the Team</h3>
                            <p className="text-gray-700 text-sm">
                                The Data Insights Corp. Advanced Analytics team is a small, dynamic unit of 15 engineers and scientists dedicated to product innovation.
                            </p>
                            <button className="mt-4 text-blue-600 font-semibold text-sm hover:underline">
                                Visit Company Profile &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetailPageV2;