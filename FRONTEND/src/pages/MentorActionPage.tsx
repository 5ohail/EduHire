import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Mock Student Data (Aisha Sharma from previous context)
const mockStudent = {
    id: 'std001',
    name: 'Aisha Sharma',
    collegeId: '2023CS001',
    major: 'Computer Science',
    currentProfileStatus: 'Needs Review', // Assume this is the current status
};

const MentorActionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [statusUpdate, setStatusUpdate] = useState('');
    const [privateNote, setPrivateNote] = useState('');
    const [profileComplete, setProfileComplete] = useState(false);

    // Placeholder for form submission
    const handleActionSubmit = (actionType: string) => (e: React.FormEvent) => {
        e.preventDefault();
        
        let message = '';
        if (actionType === 'status') {
            message = `Mentor updated status to: ${statusUpdate}`;
        } else if (actionType === 'note') {
            message = `Mentor added private note: "${privateNote.substring(0, 30)}..."`;
        } else if (actionType === 'complete') {
            message = `Mentor marked profile as ${profileComplete ? 'READY' : 'NEEDS ATTENTION'}`;
        }

        console.log(`${actionType} Action Submitted:`, message);
        
        // In a real app, this would be an API call
        alert(`Action recorded for ${mockStudent.name}: ${message}`);
        
        // Optionally navigate back to the student detail page
        navigate(`/student-directory/${mockStudent.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 font-sans">
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
                
                {/* Header and Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Student Profile
                    </button>
                </div>
                
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Actions for {mockStudent.name}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Perform administrative tasks and record feedback for the student.
                </p>

                {/* --- Action Cards --- */}
                <div className="space-y-6">

                    {/* 1. Update Student Status */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <PencilSquareIcon className="w-5 h-5 mr-2 text-indigo-600" /> Update Overall Status
                        </h2>
                        <form onSubmit={handleActionSubmit('status')} className="space-y-4">
                            <p className="text-sm text-gray-600">Current Status: 
                                <span className="font-semibold text-red-600 ml-1">{mockStudent.currentProfileStatus}</span>
                            </p>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Status
                                </label>
                                <select
                                    id="status"
                                    required
                                    value={statusUpdate}
                                    onChange={(e) => setStatusUpdate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="" disabled>Select a new status...</option>
                                    <option value="Profile Ready">Profile Ready for Placements</option>
                                    <option value="Needs More Info">Needs More Info (Contact Student)</option>
                                    <option value="Under Probation">Under Probation</option>
                                    <option value="Application Blocked">Application Blocked</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={!statusUpdate}
                                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md disabled:bg-indigo-400"
                            >
                                Apply New Status
                            </button>
                        </form>
                    </div>
                    
                    {/* 2. Add Private Mentor Note */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2 text-indigo-600" /> Add Private Note
                        </h2>
                        <form onSubmit={handleActionSubmit('note')} className="space-y-4">
                            <p className="text-sm text-gray-500 italic">
                                This note is visible only to mentors and administrative staff.
                            </p>
                            <div>
                                <label htmlFor="note" className="sr-only">Private Note</label>
                                <textarea
                                    id="note"
                                    rows={4}
                                    required
                                    value={privateNote}
                                    onChange={(e) => setPrivateNote(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your confidential review, follow-up actions, or feedback summary here..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={!privateNote.trim()}
                                className="w-full py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-md disabled:bg-gray-400"
                            >
                                Submit Private Note
                            </button>
                        </form>
                    </div>

                    {/* 3. Profile Completion Toggle */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-600" /> Mark Profile Ready
                        </h2>
                        <form onSubmit={handleActionSubmit('complete')} className="space-y-4">
                            <div className="flex items-start">
                                <input
                                    id="profile-complete-toggle"
                                    type="checkbox"
                                    checked={profileComplete}
                                    onChange={(e) => setProfileComplete(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="profile-complete-toggle" className="ml-3 text-sm text-gray-700">
                                    I confirm that I have reviewed {mockStudent.name}'s profile and it meets all technical college placement standards.
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={!profileComplete}
                                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md disabled:bg-green-400"
                            >
                                Finalize and Mark as Ready
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MentorActionsPage;