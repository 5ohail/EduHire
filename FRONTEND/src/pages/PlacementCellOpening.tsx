import React, { useState, useMemo } from 'react';
import { 
    PlusCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, BriefcaseIcon, AcademicCapIcon, BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

// --- INTERFACE DEFINITIONS ---

interface JobOpening {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    salary: string;
    branch: string;
    type: 'Full-time' | 'Internship';
    status: 'Pending Review' | 'Approved' | 'Rejected';
    submittedBy: string;
    submissionDate: number; // Unix timestamp
}

// --- SAMPLE DATA (In lieu of a Database) ---
const initialSampleJobs: JobOpening[] = [
    { id: 'j1', title: 'Full Stack Engineer (MERN)', company: 'Tech Solutions Inc.', location: 'Remote', description: 'Seeking a skilled Full Stack Engineer familiar with MongoDB, Express, React, and Node.js. Must have 2+ years experience.', salary: '12-15 LPA', branch: 'CSE/IT', type: 'Full-time', status: 'Pending Review', submittedBy: 'Recruiter A', submissionDate: 1700000000000 },
    { id: 'j2', title: 'Mechanical Design Intern', company: 'Auto Industries', location: 'Pune, IN', description: 'Internship opportunity for 6 months focused on CAD design and finite element analysis.', salary: '30k/month', branch: 'Mech', type: 'Internship', status: 'Approved', submittedBy: 'Recruiter B', submissionDate: 1700100000000 },
    { id: 'j3', title: 'Electrical Site Engineer', company: 'Energy Power Grid', location: 'Mumbai, IN', description: 'Require EEE graduate for site supervision and power system maintenance.', salary: '8 LPA', branch: 'EEE', type: 'Full-time', status: 'Pending Review', submittedBy: 'Recruiter C', submissionDate: 1700200000000 },
    { id: 'j4', title: 'Junior Data Analyst', company: 'Data Insights Co.', location: 'Hybrid', description: 'Entry-level position analyzing large datasets using Python and SQL.', salary: '6.5 LPA', branch: 'CSE/IT', type: 'Full-time', status: 'Rejected', submittedBy: 'Recruiter D', submissionDate: 1700300000000 },
    { id: 'j5', title: 'Civil Project Manager', company: 'BuildWell Corp', location: 'Delhi, IN', description: 'Experienced manager for large scale infrastructure projects.', salary: '18 LPA', branch: 'Civil', type: 'Full-time', status: 'Approved', submittedBy: 'Recruiter E', submissionDate: 1700400000000 },
    { id: 'j6', title: 'IT Security Intern', company: 'SecureNet', location: 'Bangalore, IN', description: 'Internship focusing on network security and penetration testing.', salary: '25k/month', branch: 'IT', type: 'Internship', status: 'Pending Review', submittedBy: 'Recruiter F', submissionDate: 1700500000000 },
];

// Initial state for the new job form
const initialNewJobState = {
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    branch: '',
    type: 'Full-time' as 'Full-time' | 'Internship',
};

// --- SUB-COMPONENTS ---

// Status Badge Component
const StatusBadge = ({ status }: { status: JobOpening['status'] }) => {
    let classes = '';
    let Icon = ClockIcon;
    switch (status) {
        case 'Approved':
            classes = 'bg-teal-100 text-teal-700 ring-teal-500';
            Icon = CheckCircleIcon;
            break;
        case 'Rejected':
            classes = 'bg-red-100 text-red-700 ring-red-500';
            Icon = XCircleIcon;
            break;
        case 'Pending Review':
        default:
            classes = 'bg-amber-100 text-amber-700 ring-amber-500';
            Icon = ClockIcon;
            break;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset ${classes}`}>
            <Icon className="w-4 h-4 mr-1.5" />
            {status}
        </span>
    );
};

// Job Opening Card Component for the List (Receives setJobs function)
const JobOpeningCard = ({ job, setJobs }: { job: JobOpening, setJobs: React.Dispatch<React.SetStateAction<JobOpening[]>> }) => {
    const isAdmin = true; // Assuming the user viewing this is the Placement Officer

    const updateStatus = (newStatus: JobOpening['status']) => {
        // Update local state instead of calling Firestore updateDoc
        setJobs(prevJobs => 
            prevJobs.map(j => 
                j.id === job.id ? { ...j, status: newStatus } : j
            )
        );
        console.log(`Job ${job.id} status locally updated to ${newStatus}`);
    };

    const isActionPending = job.status === 'Pending Review';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-200 hover:shadow-xl">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
                <StatusBadge status={job.status} />
            </div>

            <p className="text-sm font-medium text-indigo-600 mb-2 flex items-center">
                <BuildingOfficeIcon className="w-4 h-4 mr-1.5" /> {job.company} 
                <span className="mx-2 text-gray-400">|</span> 
                {job.location}
            </p>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 border-t border-gray-100 pt-3">
                <p><span className="font-semibold">Type:</span> {job.type}</p>
                <p><span className="font-semibold">Branch:</span> {job.branch}</p>
                <p><span className="font-semibold">Salary:</span> {job.salary}</p>
                <p><span className="font-semibold">Submitted:</span> {new Date(job.submissionDate).toLocaleDateString()}</p>
            </div>

            {isAdmin && isActionPending && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={() => updateStatus('Approved')}
                        className="flex-1 flex justify-center items-center py-2 px-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150"
                    >
                        <CheckCircleIcon className="w-5 h-5 mr-2" /> Approve
                    </button>
                    <button
                        onClick={() => updateStatus('Rejected')}
                        className="flex-1 flex justify-center items-center py-2 px-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150"
                    >
                        <XCircleIcon className="w-5 h-5 mr-2" /> Reject
                    </button>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---

const JobOpeningManagerFrontend: React.FC = () => {
    // State to hold all job openings (initialized with sample data)
    const [jobs, setJobs] = useState<JobOpening[]>(initialSampleJobs);
    
    const [newJob, setNewJob] = useState(initialNewJobState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');


    // 1. JOB SUBMISSION HANDLER (Updates local state)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewJob(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Simple validation
        if (!newJob.title || !newJob.company || !newJob.description) {
            setSubmitMessage({ type: 'error', text: 'Please fill in all required fields (Title, Company, Description).' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        // Simulate async submission and local state update
        setTimeout(() => {
            try {
                // Generates a simple new ID
                const newId = `j${jobs.length + 1}-${Date.now()}`; 
                
                const jobData: JobOpening = {
                    id: newId,
                    ...newJob,
                    status: 'Pending Review',
                    submittedBy: 'Local Officer (Demo)',
                    submissionDate: Date.now(),
                };

                setJobs(prevJobs => [...prevJobs, jobData]);
                
                setSubmitMessage({ type: 'success', text: 'Job opening submitted successfully! Added to Pending Review.' });
                setNewJob(initialNewJobState); // Reset form
            } catch (error) {
                console.error("Error adding job:", error);
                setSubmitMessage({ type: 'error', text: 'Failed to submit job locally.' });
            } finally {
                setIsSubmitting(false);
            }
        }, 500); // Simulate network latency
    };

    // 2. FILTERING JOBS FOR TABS
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => job.status === activeTab);
    }, [jobs, activeTab]);

    const getJobCount = (status: JobOpening['status']) => {
        return jobs.filter(job => job.status === status).length;
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <BriefcaseIcon className="w-10 h-10 text-indigo-600 mr-4"/> Placement Job Manager (Frontend Demo)
                    </h1>
                    <p className="text-gray-500 mt-2">
                        View, submit, and manage job opening statuses. **Note: This version uses local state and is NOT connected to a database.**
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: JOB SUBMISSION FORM --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                                <PlusCircleIcon className="w-6 h-6 text-indigo-500 mr-2" /> Add New Job Opening
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        name="title"
                                        placeholder="Job Title (e.g., Senior Data Scientist)"
                                        value={newJob.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    <input 
                                        type="text" 
                                        name="company"
                                        placeholder="Company Name"
                                        value={newJob.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    <textarea 
                                        name="description"
                                        placeholder="Job Description and Responsibilities"
                                        rows={4}
                                        value={newJob.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    ></textarea>
                                    <input 
                                        type="text" 
                                        name="location"
                                        placeholder="Location (City, Remote, Hybrid)"
                                        value={newJob.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <input 
                                        type="text" 
                                        name="salary"
                                        placeholder="Salary/CTC (e.g., 10 LPA)"
                                        value={newJob.salary}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <select
                                        name="branch"
                                        value={newJob.branch}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                    >
                                        <option value="">Select Target Branch</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="IT">IT</option>
                                        <option value="Mech">Mech</option>
                                        <option value="Civil">Civil</option>
                                        <option value="All">All Branches</option>
                                    </select>
                                    <select
                                        name="type"
                                        value={newJob.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                
                                {submitMessage && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${submitMessage.type === 'success' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                                        {submitMessage.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-6 flex justify-center items-center py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Job for Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* --- RIGHT COLUMN: JOB REVIEW DASHBOARD --- */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <AcademicCapIcon className="w-6 h-6 text-indigo-500 mr-2" /> Job Review Pipeline
                        </h2>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-6">
                            {(['Pending Review', 'Approved', 'Rejected'] as JobOpening['status'][]).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setActiveTab(status)}
                                    className={`px-5 py-3 text-sm font-medium border-b-2 transition duration-150 ${
                                        activeTab === status
                                            ? 'border-indigo-500 text-indigo-600 bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {status} ({getJobCount(status)})
                                </button>
                            ))}
                        </div>

                        {/* Job List */}
                        {filteredJobs.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center text-gray-500">
                                No {activeTab} jobs found. Time to submit some or review the pending ones!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredJobs.map(job => (
                                    <JobOpeningCard 
                                        key={job.id} 
                                        job={job} 
                                        setJobs={setJobs} // Pass local state setter
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobOpeningManagerFrontend;
