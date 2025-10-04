import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Imported Link
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/outline';

// --- Interface Definitions (Omitted for brevity, assume they are defined) ---
interface StudentDetails {
    id: string;
    name: string;
    collegeId: string;
    major: string;
    gpa: number;
    skills: string[];
    bio: string;
    contactEmail: string;
    phone: string;
    resumeLink: string;
}

interface Application {
    id: number;
    jobTitle: string;
    company: string;
    status: 'Interview' | 'Applied' | 'Rejected' | 'Hired';
    date: string;
}

interface LogEntry {
    id: number;
    date: string;
    timeSpent: string;
    task: string;
    comment: string;
}

// --- Mock Data (Omitted for brevity, assume they are defined) ---
const mockStudent: StudentDetails = {
    id: 'std001',
    name: 'Aisha Sharma',
    collegeId: '2023CS001',
    major: 'Computer Science',
    gpa: 8.7,
    skills: ['Python', 'React', 'AWS', 'SQL', 'Data Structures'],
    bio: 'Highly motivated final year student with a focus on full-stack development and cloud infrastructure. Seeking challenging roles in technology.',
    contactEmail: 'aisha.sharma@college.edu',
    phone: '+91 98765 43210',
    resumeLink: '#',
};

const mockApplications: Application[] = [
    { id: 1, jobTitle: 'Junior Backend Developer', company: 'Innovatech', status: 'Interview', date: '2025-09-15' },
    { id: 2, jobTitle: 'Cloud Solutions Intern', company: 'GlobalTech', status: 'Applied', date: '2025-09-01' },
    { id: 3, jobTitle: 'Data Analyst Trainee', company: 'FinCorp', status: 'Rejected', date: '2025-08-20' },
    { id: 4, jobTitle: 'Full Stack Intern', company: 'VentureLeap', status: 'Hired', date: '2025-07-10' },
];

const mockLogs: LogEntry[] = [
    { id: 1, date: '2025-10-03', timeSpent: '3h 30m', task: 'Innovatech API integration', comment: 'Completed unit tests for new endpoint.' },
    { id: 2, date: '2025-10-02', timeSpent: '1h 00m', task: 'Daily Standup', comment: 'Discussed blocker on GlobalTech project.' },
    { id: 3, date: '2025-10-01', timeSpent: '4h 15m', task: 'GlobalTech deployment fix', comment: 'Resolved configuration error in Terraform scripts.' },
];

// Helper to get application status badge classes (Omitted for brevity)
const getAppStatusClasses = (status: Application['status']): string => {
    switch (status) {
        case 'Hired': return 'bg-teal-100 text-teal-700';
        case 'Interview': return 'bg-yellow-100 text-yellow-700';
        case 'Applied': return 'bg-indigo-100 text-indigo-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
    }
};

// --- Profile Section Component (Uses simple divs/text, no change needed) ---

const ProfileSection: React.FC<{ student: StudentDetails }> = ({ student }) => (
    <div className="space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AcademicCapIcon className="w-5 h-5 mr-2 text-indigo-600" /> Academic & Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold text-gray-700">College ID:</span> {student.collegeId}</p>
                <p><span className="font-semibold text-gray-700">Major:</span> {student.major}</p>
                <p><span className="font-semibold text-gray-700">GPA (CGPA):</span> {student.gpa}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {student.contactEmail}</p>
                <p><span className="font-semibold text-gray-700">Phone:</span> {student.phone}</p>
            </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckBadgeIcon className="w-5 h-5 mr-2 text-indigo-600" /> Skills & Bio
            </h3>
            <p className="text-sm text-gray-600 mb-4">{student.bio}</p>
            <div className="mt-4">
                <span className="font-semibold text-gray-700 block mb-2">Key Skills:</span>
                <div className="flex flex-wrap gap-2">
                    {student.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- Applications Section Component (No internal links, no change needed) ---

const ApplicationsSection: React.FC<{ applications: Application[] }> = ({ applications }) => (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-indigo-600" /> Application History
        </h3>
        <ul className="divide-y divide-gray-200">
            {applications.map(app => (
                <li key={app.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 -mx-2 rounded-lg">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{app.jobTitle} at {app.company}</p>
                        <p className="text-xs text-gray-500 mt-1">Applied on {app.date}</p>
                    </div>
                    <span 
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getAppStatusClasses(app.status)}`}
                    >
                        {app.status}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

// --- Logs Section Component (No internal links, no change needed) ---

const LogsSection: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-indigo-600" /> Work & Activity Logs
        </h3>
        <ul className="space-y-4">
            {logs.map(log => (
                <li key={log.id} className="p-3 bg-gray-50 border-l-4 border-indigo-400 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>{log.date}</span>
                        <span className="font-semibold text-indigo-600">{log.timeSpent} Logged</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{log.task}</p>
                    <p className="text-xs text-gray-600 italic mt-1">{log.comment}</p>
                </li>
            ))}
        </ul>
    </div>
);


// --- Main Student Detail Page Component ---

const StudentDetailPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'logs'>('profile');
    
    const tabs = [
        { id: 'profile', label: 'Profile Overview', icon: AcademicCapIcon, component: <ProfileSection student={mockStudent} /> },
        { id: 'applications', label: 'Applications', icon: BriefcaseIcon, component: <ApplicationsSection applications={mockApplications} /> },
        { id: 'logs', label: 'Work Logs', icon: ClockIcon, component: <LogsSection logs={mockLogs} /> },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="min-h-screen bg-gray-50 py-10 font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-end mb-6 border-b pb-4">
                    <div>
                        <p className="text-xl font-semibold text-gray-500">Viewing Student:</p>
                        <h1 className="text-4xl font-extrabold text-gray-900">{mockStudent.name}</h1>
                        <p className="text-sm text-gray-600 mt-1">{mockStudent.major} | ID: {mockStudent.collegeId}</p>
                    </div>
                    <div className="flex space-x-3">
                        {/* Download Resume Button (Use <a> tag for external file download) */}
                        <a 
                            href={mockStudent.resumeLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            <DocumentTextIcon className="w-5 h-5 mr-2" />
                            Download Resume
                        </a>
                        {/* Mentor Actions Button (Use Link if it navigates to an internal form/page) */}
                        <Link 
                            to={`/mentor/action/${mockStudent.id}`} // Example internal route for an action
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition"
                        >
                            Mentor Actions
                        </Link>
                    </div>
                </div>

                {/* --- Tab Navigation --- */}
                <div className="mb-8">
                    <nav className="flex space-x-4 border-b border-gray-200" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'profile' | 'applications' | 'logs')}
                                    className={`
                                        ${isActive
                                            ? 'border-indigo-500 text-indigo-600 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                        group inline-flex items-center py-4 px-1 border-b-2 text-sm font-medium transition duration-150
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* --- Tab Content --- */}
                {ActiveComponent}

            </div>
        </div>
    );
};

export default StudentDetailPage;