import React, { useState } from 'react';
import { Send, Star, User, Briefcase, FileText, Loader2, CheckCircle, Clock } from 'lucide-react';

/**
 * Applicant type definition (copied from ApplicantTracker for context).
 */
interface Applicant {
  id: number;
  name: string;
  email: string;
  field: string;
  status: 'Hired' | 'Interviewing' | 'Applied' | 'Rejected';
  date: string;
}

/**
 * Feedback type definition
 */
interface Feedback {
    id: number;
    candidateId: number;
    recruiterId: string;
    jobField: string;
    rating: number;
    feedback: string;
    timestamp: string;
}

// --- MOCK DATA FOR DROPDOWN ---
const mockApplicants: Applicant[] = [
  { id: 101, name: 'Alice Johnson', email: 'alice.j@example.com', field: 'Software Engineering', status: 'Hired', date: '2024-10-01' },
  { id: 102, name: 'Bob Smith', email: 'bob.s@example.com', field: 'Data Science', status: 'Interviewing', date: '2024-09-28' },
  { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com', field: 'Product Management', status: 'Applied', date: '2024-10-02' },
  { id: 104, name: 'Dana Lee', email: 'dana.l@example.com', field: 'Software Engineering', status: 'Applied', date: '2024-10-03' },
  { id: 105, name: 'Evan Green', email: 'evan.g@example.com', field: 'Data Science', status: 'Rejected', date: '2024-09-25' },
];

// --- MOCK DATA FOR DISPLAYING LAST FEEDBACK ---
const mockFeedback: Feedback[] = [
    { id: 1, candidateId: 105, recruiterId: 'mock-recruiter-123', jobField: 'Data Science', rating: 2, feedback: "Candidate lacked necessary statistical programming knowledge. Weak performance in the technical section.", timestamp: '2024-10-03T10:00:00Z' },
    { id: 2, candidateId: 102, recruiterId: 'mock-recruiter-123', jobField: 'Data Science', rating: 4, feedback: "Very strong communication skills and clear understanding of ML fundamentals. Needs minor work on cloud deployment, but highly recommended for the interviewing stage.", timestamp: '2024-10-04T15:30:00Z' },
];

/**
 * Reusable Star Rating Component (for input and display)
 */
const StarRating = ({ rating, setRating, maxStars = 5, isInteractive = true }: { rating: number; setRating: (rating: number) => void; maxStars?: number; isInteractive?: boolean; }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const baseClasses = 'w-6 h-6 transition-colors duration-150';
                const interactiveClasses = isInteractive ? 'cursor-pointer hover:text-yellow-500' : '';
                
                return (
                    <Star
                        key={index}
                        className={`${baseClasses} ${interactiveClasses} ${
                            starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={isInteractive ? () => setRating(starValue) : undefined}
                    />
                );
            })}
        </div>
    );
};

/**
 * Component to display the last piece of feedback submitted by the recruiter.
 */
const LastFeedbackCard = ({ lastFeedback }: { lastFeedback: Feedback | undefined }) => {
    if (!lastFeedback) {
        return (
            <div className="p-6 bg-gray-100 border border-gray-200 rounded-2xl h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">No previous feedback found for this recruiter.</p>
            </div>
        );
    }

    const candidate = mockApplicants.find(a => a.id === lastFeedback.candidateId);
    const candidateName = candidate ? candidate.name : `ID: ${lastFeedback.candidateId}`;
    const formattedDate = new Date(lastFeedback.timestamp).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="p-6 bg-white border border-indigo-200 rounded-2xl shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Last Submitted Feedback
            </h2>
            <div className="space-y-4 flex-grow">
                
                {/* Candidate Info */}
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-500 font-medium">Candidate:</p>
                    <p className="text-lg font-semibold text-gray-800">{candidateName}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {lastFeedback.jobField}
                    </p>
                </div>

                {/* Rating */}
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Overall Rating:</p>
                    <StarRating rating={lastFeedback.rating} setRating={() => {}} isInteractive={false} />
                    <p className="text-xs text-gray-500 mt-1">Submitted on: {formattedDate}</p>
                </div>

                {/* Feedback Notes */}
                <div className="pt-2">
                    <p className="text-sm text-gray-500 font-medium mb-1">Notes:</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm overflow-y-auto max-h-40">
                        {lastFeedback.feedback}
                    </div>
                </div>
            </div>
        </div>
    );
};


const App = () => {
    const [selectedCandidateId, setSelectedCandidateId] = useState('');
    const [field, setField] = useState('');
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Find the most recent feedback to display in the card
    const lastFeedback = mockFeedback.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];


    // Automatically set the job field when a candidate is selected
    React.useEffect(() => {
        const candidate = mockApplicants.find(a => a.id.toString() === selectedCandidateId);
        setField(candidate ? candidate.field : '');
    }, [selectedCandidateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedCandidateId || rating === 0 || feedbackText.trim() === '') {
            alert('Please fill out all required fields.'); 
            return;
        }

        setStatus('loading');

        const feedbackData = {
            candidateId: parseInt(selectedCandidateId),
            jobField: field,
            rating: rating,
            feedback: feedbackText,
            recruiterId: 'mock-recruiter-123', 
            timestamp: new Date().toISOString()
        };

        console.log('Submitting Feedback:', feedbackData);

        // --- MOCK API CALL ---
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

            // In a real MERN app, you would use:
            // const response = await fetch('/api/feedback', { ... });
            // if (!response.ok) throw new Error('Failed to submit feedback');

            setStatus('success');
            // Clear form after successful submission
            setSelectedCandidateId('');
            setRating(0);
            setFeedbackText('');
            // NOTE: In a real app, you would also update the mockFeedback state here.
            
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        } finally {
            // Reset status after a delay to show success/error message
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const isSubmitting = status === 'loading';

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <div className="max-w-7xl mx-auto"> 

                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Candidate Interview Feedback
                    </h1>
                    <p className="mt-2 text-lg text-gray-500">
                        Submit your assessment for the candidate and review your recent notes.
                    </p>
                    <div className="h-1 w-24 bg-indigo-500 mt-3 rounded-full mx-auto"></div>
                </header>

                {/* Main Content: Form (Left) and Last Feedback (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Feedback Form (2/3 width on large screens) */}
                    <div className="lg:col-span-2 bg-white shadow-2xl rounded-3xl p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Feedback Submission</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Candidate Selector */}
                            <div>
                                <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-indigo-500" />
                                    Candidate Name
                                </label>
                                <select
                                    id="candidate"
                                    value={selectedCandidateId}
                                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none bg-white transition duration-150"
                                    required
                                >
                                    <option value="" disabled>Select a candidate...</option>
                                    {mockApplicants.map(candidate => (
                                        <option key={candidate.id} value={candidate.id}>
                                            {candidate.name} - {candidate.field}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Field (Auto-Populated) */}
                            <div>
                                <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                                    Job / Internship Field
                                </label>
                                <input
                                    id="field"
                                    type="text"
                                    value={field}
                                    readOnly
                                    className="w-full pl-3 pr-10 py-2 bg-gray-100 border border-gray-300 rounded-xl shadow-inner text-gray-600 cursor-default"
                                />
                            </div>

                            {/* Overall Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Star className="w-4 h-4 mr-2 text-indigo-500" />
                                    Overall Rating (1-5)
                                </label>
                                <StarRating rating={rating} setRating={setRating} isInteractive={true} />
                                <p className="mt-1 text-xs text-gray-500">Rating: {rating} / 5</p>
                            </div>

                            {/* Feedback Text Area */}
                            <div>
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                                    Detailed Feedback Notes
                                </label>
                                <textarea
                                    id="feedback"
                                    rows={6}
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="Describe the candidate's strengths, weaknesses, and final recommendation..."
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 resize-none"
                                    required
                                />
                            </div>

                            {/* Submission Button and Status */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-3" />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Success/Error Message */}
                            {status === 'success' && (
                                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Feedback successfully submitted!
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-xl">
                                    Error submitting feedback. Please try again.
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Last Feedback Card (1/3 width on large screens) */}
                    <div className="lg:col-span-1">
                        <LastFeedbackCard lastFeedback={lastFeedback} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default App;
