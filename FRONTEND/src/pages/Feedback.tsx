import React, { useState, useMemo } from 'react';
import { 
    ChatBubbleLeftRightIcon, UserIcon, ClipboardDocumentListIcon, StarIcon, CheckCircleIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';

// --- 1. INTERFACES & SAMPLE DATA ---

interface StudentFeedback {
    id: number;
    studentId: number;
    studentName: string;
    topic: 'Interview Performance' | 'Internship Review' | 'Technical Assessment' | 'Soft Skills';
    company: string;
    rating: number; // 1 to 5 stars
    comments: string;
    feedbackDate: number; // Unix timestamp
    reviewer: string;
}

// Mock Student List for the selection dropdown
const mockStudents = [
    { id: 1, name: 'Alice Johnson', branch: 'CSE' },
    { id: 2, name: 'Bob Williams', branch: 'ECE' },
    { id: 3, name: 'Charlie Brown', branch: 'CSE' },
    { id: 7, name: 'Grace Lee', branch: 'ECE' },
    { id: 9, name: 'Ivy Davis', branch: 'Mech' },
    { id: 10, name: 'Jack Miller', branch: 'CSE' },
];

// Initial Sample Feedback Data
const initialFeedbackData: StudentFeedback[] = [
    { 
        id: 101, studentId: 3, studentName: 'Charlie Brown', topic: 'Interview Performance', company: 'Web Solutions', 
        rating: 4, comments: 'Strong understanding of React hooks, but needs practice in system design architecture.', 
        feedbackDate: 1700457600000, reviewer: 'Mentor A' 
    },
    { 
        id: 102, studentId: 7, studentName: 'Grace Lee', topic: 'Internship Review', company: 'Robotics Inc', 
        rating: 5, comments: 'Exceptional problem-solving skills and highly proactive in learning new embedded systems.', 
        feedbackDate: 1700371200000, reviewer: 'Dr. Smith' 
    },
    { 
        id: 103, studentId: 10, studentName: 'Jack Miller', topic: 'Technical Assessment', company: 'Cloud Solutions', 
        rating: 3, comments: 'Code quality was good, but struggled slightly with the time constraints of the challenge.', 
        feedbackDate: 1700284800000, reviewer: 'Mentor B' 
    },
];

// Initial state for the feedback form
const initialNewFeedbackState = {
    studentId: 0,
    studentName: '',
    topic: '' as StudentFeedback['topic'],
    company: '',
    rating: 5,
    comments: '',
    reviewer: 'Placement Officer',
};

// --- 2. HELPER COMPONENTS ---

// Rating Stars Component
const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`w-5 h-5 transition-colors duration-150 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    );
};

// --- 3. MAIN COMPONENT ---

const PlacementFeedbackManager: React.FC = () => {
    const [feedbackRecords, setFeedbackRecords] = useState<StudentFeedback[]>(initialFeedbackData);
    const [newFeedback, setNewFeedback] = useState(initialNewFeedbackState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Get the highest ID to assign a new unique ID
    const nextId = useMemo(() => {
        return feedbackRecords.length > 0 
            ? Math.max(...feedbackRecords.map(f => f.id)) + 1 
            : 101;
    }, [feedbackRecords]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle student selection which needs to update both ID and Name
        if (name === 'studentId') {
            const selectedStudent = mockStudents.find(s => s.id === parseInt(value));
            setNewFeedback(prev => ({ 
                ...prev, 
                studentId: parseInt(value), 
                studentName: selectedStudent ? selectedStudent.name : ''
            }));
        } else if (name === 'rating') {
            setNewFeedback(prev => ({ ...prev, rating: parseInt(value) }));
        } else {
            setNewFeedback(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission (local state update only)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !newFeedback.studentName || !newFeedback.comments) return;

        setIsSubmitting(true);
        setSubmitMessage(null);

        const feedbackData: StudentFeedback = {
            id: nextId,
            ...newFeedback,
            feedbackDate: Date.now(),
        };

        setTimeout(() => {
            setFeedbackRecords(prev => [feedbackData, ...prev]);
            setSubmitMessage({ type: 'success', text: 'Feedback submitted successfully!' });
            setNewFeedback(initialNewFeedbackState); 
            setIsSubmitting(false);
        }, 500); // Simulate network latency
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-600 mr-4"/> Placement Feedback Manager
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                        Log and review performance feedback from interviews and internships.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: FEEDBACK SUBMISSION FORM --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                                <PlusCircleIcon className="w-6 h-6 text-indigo-500 mr-2" /> Submit New Feedback
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    
                                    {/* Student Selector */}
                                    <select
                                        name="studentId"
                                        value={newFeedback.studentId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                        required
                                    >
                                        <option value={0} disabled>--- Select Student ---</option>
                                        {mockStudents.map(student => (
                                            <option key={student.id} value={student.id}>{student.name} ({student.branch})</option>
                                        ))}
                                    </select>

                                    {/* Topic Selector */}
                                    <select
                                        name="topic"
                                        value={newFeedback.topic}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>--- Select Topic ---</option>
                                        <option value="Interview Performance">Interview Performance</option>
                                        <option value="Internship Review">Internship Review</option>
                                        <option value="Technical Assessment">Technical Assessment</option>
                                        <option value="Soft Skills">Soft Skills</option>
                                    </select>
                                    
                                    <input 
                                        type="text" 
                                        name="company"
                                        placeholder="Company / Interviewer"
                                        value={newFeedback.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />

                                    {/* Rating Slider */}
                                    <div className="pt-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rating: {newFeedback.rating} / 5
                                        </label>
                                        <input 
                                            type="range" 
                                            name="rating"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={newFeedback.rating}
                                            onChange={handleInputChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                                        />
                                    </div>

                                    <textarea 
                                        name="comments"
                                        placeholder="Detailed Comments on Performance"
                                        rows={5}
                                        value={newFeedback.comments}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    ></textarea>
                                </div>
                                
                                {submitMessage && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${submitMessage.type === 'success' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                                        <CheckCircleIcon className="w-5 h-5 inline mr-2"/> {submitMessage.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || newFeedback.studentId === 0}
                                    className="w-full mt-6 flex justify-center items-center py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving Feedback...' : 'Submit Feedback'}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* --- RIGHT COLUMN: FEEDBACK HISTORY --- */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-indigo-500 mr-2" /> Feedback History ({feedbackRecords.length})
                        </h2>

                        {feedbackRecords.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center text-gray-500">
                                No feedback records found. Submit the first one!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {feedbackRecords.map(feedback => (
                                    <div 
                                        key={feedback.id} 
                                        className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
                                    >
                                        <div className="flex justify-between items-center border-b pb-3 mb-3">
                                            <div>
                                                <p className="text-xl font-bold text-gray-900 flex items-center">
                                                    <UserIcon className="w-5 h-5 mr-2 text-indigo-500"/> {feedback.studentName}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Topic: <span className="font-semibold text-gray-700">{feedback.topic}</span>
                                                </p>
                                            </div>
                                            <RatingStars rating={feedback.rating} />
                                        </div>
                                        
                                        <p className="text-gray-700 mb-4 italic leading-relaxed">
                                            "{feedback.comments}"
                                        </p>
                                        
                                        <div className="text-xs text-gray-500 flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span>
                                                Reviewed by: <span className="font-semibold text-gray-600">{feedback.reviewer}</span> 
                                                <span className="mx-2 text-gray-300">|</span> 
                                                {feedback.company}
                                            </span>
                                            <span>
                                                {new Date(feedback.feedbackDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlacementFeedbackManager;
