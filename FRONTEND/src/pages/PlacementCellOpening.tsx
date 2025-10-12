import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    PlusCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, BriefcaseIcon, AcademicCapIcon, BuildingOfficeIcon, ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// ==============================================================================
// 1. SCHEMA DEFINITION
// ==============================================================================

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

// Data required when creating a new job (i.e., the request body payload)
type CreateJobPayload = Omit<JobOpening, 'id' | 'status' | 'submittedBy' | 'submissionDate'>;
type UpdateStatusPayload = { status: JobOpening['status'] };


// ==============================================================================
// 2. REAL BACKEND API CALLS (Using fetch to communicate with Express/Node)
// ==============================================================================
// NOTE: These URLs assume a real Express server is running on http://localhost:5000
const API_BASE_URL = 'http://localhost:5000/api/jobs';

/**
 * Handles JSON response parsing and common HTTP error checking.
 */
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        // Attempt to read the error message from the response body
        let errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            errorText = errorJson.message || errorText;
        } catch (e) {
            // If it's not JSON, use the raw text or status text
            errorText = errorText || response.statusText;
        }
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    // Check for 204 No Content (e.g., successful delete or simple patch)
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

// 1. GET ALL JOBS (GET /api/jobs)
const fetchAllJobsApi = async (): Promise<JobOpening[]> => {
    const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const result = await handleResponse(response);

    // Defensive check: Ensure the result from the API is an array before returning
    if (!Array.isArray(result)) {
        throw new Error("Invalid data format received from server. Expected an array of jobs.");
    }
    
    return result as JobOpening[];
};

// 2. CREATE JOB (POST /api/jobs)
const createJobApi = async (payload: CreateJobPayload): Promise<JobOpening> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    // Expecting the backend to return the newly created JobOpening object
    return handleResponse(response) as Promise<JobOpening>;
};

// 3. UPDATE JOB STATUS (PATCH /api/jobs/:id/status)
const updateJobStatusApi = async (jobId: string, payload: UpdateStatusPayload): Promise<JobOpening> => {
    const response = await fetch(`${API_BASE_URL}/${jobId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    // Expecting the backend to return the updated JobOpening object
    return handleResponse(response) as Promise<JobOpening>;
};


// Initial state for the new job form
const initialNewJobState: CreateJobPayload = {
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    branch: '',
    type: 'Full-time',
};

// ==============================================================================
// 3. SUB-COMPONENTS
// ==============================================================================

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

// Job Opening Card Component with API Integration
const JobOpeningCard = ({ job, setJobs, setError }: { 
    job: JobOpening, 
    setJobs: React.Dispatch<React.SetStateAction<JobOpening[]>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
}) => {
    const isAdmin = true;
    const [isUpdating, setIsUpdating] = useState(false);

    const updateStatus = useCallback(async (newStatus: JobOpening['status']) => {
        setIsUpdating(true);
        setError(null);
        try {
            // CALL BACKEND API: PATCH /api/jobs/:id/status
            const result = await updateJobStatusApi(job.id, { status: newStatus }); 
            
            // Update the local state with the confirmed, fully updated job object from the server
            setJobs(prevJobs => 
                prevJobs.map(j => 
                    j.id === result.id ? result : j
                )
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Failed to update job status via API:", error);
            setError(`Failed to update status for ${job.title}. Error: ${errorMessage}`);
        } finally {
            setIsUpdating(false);
        }
    }, [job.id, setJobs, setError, job.title]);

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
                        disabled={isUpdating}
                        className="flex-1 flex justify-center items-center py-2 px-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150 disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        <CheckCircleIcon className="w-5 h-5 mr-2" /> {isUpdating ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                        onClick={() => updateStatus('Rejected')}
                        disabled={isUpdating}
                        className="flex-1 flex justify-center items-center py-2 px-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        <XCircleIcon className="w-5 h-5 mr-2" /> {isUpdating ? 'Rejecting...' : 'Reject'}
                    </button>
                </div>
            )}
        </div>
    );
};

// ==============================================================================
// 4. MAIN COMPONENT (Frontend Controller)
// ==============================================================================

const JobOpeningManagerFrontend: React.FC = () => {
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newJob, setNewJob] = useState(initialNewJobState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');

    // --- EFFECT FOR INITIAL DATA FETCH (Backend Integration: GET /api/jobs) ---
    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // CALL REAL BACKEND API: GET http://localhost:5000/api/jobs
                const fetchedJobs = await fetchAllJobsApi();
                setJobs(fetchedJobs);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown fetch error occurred.";
                console.error("Error fetching jobs:", err);
                setError(`Failed to load job listings from server. Please ensure the backend is running on ${API_BASE_URL}. Error: ${errorMessage}`);
                setJobs([]); // Clear jobs on error
            } finally {
                setIsLoading(false);
            }
        };

        loadJobs();
    }, []); 

    // 1. JOB SUBMISSION HANDLER (Backend Integration: POST /api/jobs)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewJob(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Simple validation
        if (!newJob.title || !newJob.company || !newJob.description || !newJob.branch || !newJob.salary) {
            setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);
        setError(null);

        try {
            // CALL REAL BACKEND API: POST http://localhost:5000/api/jobs
            const createdJob = await createJobApi(newJob);
            
            // Update local state with the job object returned from the API 
            setJobs(prevJobs => [...prevJobs, createdJob]);
            
            setSubmitMessage({ type: 'success', text: `Job "${createdJob.title}" submitted successfully! (ID: ${createdJob.id})` });
            setNewJob(initialNewJobState); // Reset form
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Error submitting job:", error);
            setSubmitMessage({ type: 'error', text: `Submission Failed: ${errorMessage}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2. FILTERING JOBS FOR TABS (FIXED: Added Array.isArray check)
    const filteredJobs = useMemo(() => {
        // Ensure 'jobs' is an array before calling filter/sort
        const jobArray = Array.isArray(jobs) ? jobs : [];

        return jobArray
            .filter(job => job.status === activeTab)
            // Sort by submission date, newest first
            .sort((a, b) => b.submissionDate - a.submissionDate); 
    }, [jobs, activeTab]);

    const getJobCount = (status: JobOpening['status']) => {
        // Use the guarded list for filtering
        const jobArray = Array.isArray(jobs) ? jobs : [];
        return jobArray.filter(job => job.status === status).length;
    };


    // --- RENDER LOGIC ---

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <BriefcaseIcon className="w-10 h-10 text-indigo-600 mr-4"/> Placement Job Manager 
                    </h1>
                    {/* <p className="text-gray-500 mt-2">
                        This application is now configured to communicate with a **real Express/Node backend** using the browser's `fetch` API.
                    </p> */}
                    {/* <div className="flex items-center text-sm mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-700">
                        <ArchiveBoxIcon className="w-5 h-5 mr-2 text-indigo-500" /> 
                        <span className="font-medium">API Endpoints:</span> The application targets `http://localhost:5000/api/jobs` for all data operations.
                    </div> */}
                </header>
{/* 
                {error && (
                    <div className="bg-red-100 p-4 rounded-lg text-red-700 font-medium mb-6 border border-red-300">
                        Global Error: {error}
                    </div>
                )} */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: JOB SUBMISSION FORM --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 lg:sticky lg:top-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                                <PlusCircleIcon className="w-6 h-6 text-indigo-500 mr-2" /> Add New Job Opening
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <input type="text" name="title" placeholder="Job Title (e.g., Senior Data Scientist)*" value={newJob.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required/>
                                    <input type="text" name="company" placeholder="Company Name*" value={newJob.company} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required/>
                                    <textarea name="description" placeholder="Job Description and Responsibilities*" rows={4} value={newJob.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                                    <input type="text" name="location" placeholder="Location (City, Remote, Hybrid)" value={newJob.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                    <input type="text" name="salary" placeholder="Salary/CTC (e.g., 10 LPA)*" value={newJob.salary} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required/>
                                    
                                    <select name="branch" value={newJob.branch} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white" required>
                                         <option value="">Select Target Branch*</option>
                                         <option value="CSE/IT">CSE/IT</option>
                                         <option value="ECE">ECE</option>
                                         <option value="EEE">EEE</option>
                                         <option value="Mech">Mechanical</option>
                                         <option value="Civil">Civil</option>
                                         <option value="All">All Branches</option>
                                    </select>
                                    <select name="type" value={newJob.type} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white">
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
                        <div className="flex border-b border-gray-200 mb-6 flex-wrap">
                            {(['Pending Review', 'Approved', 'Rejected'] as JobOpening['status'][]).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setActiveTab(status)}
                                    className={`px-5 py-3 text-sm font-medium border-b-2 transition duration-150 whitespace-nowrap ${
                                        activeTab === status
                                            ? 'border-indigo-500 text-indigo-600 bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {status} ({getJobCount(status)})
                                </button>
                            ))}
                        </div>

                        {/* Job List / Loading / Error */}
                        {isLoading ? (
                            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center text-indigo-500 font-semibold">
                                <ClockIcon className="w-6 h-6 mx-auto mb-2 animate-spin" /> Loading job data from backend...
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center text-gray-500">
                                No {activeTab} jobs found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredJobs.map(job => (
                                    <JobOpeningCard 
                                        key={job.id} 
                                        job={job} 
                                        setJobs={setJobs} // Passes job list setter
                                        setError={setError} // Passes error setter for card-level errors
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
