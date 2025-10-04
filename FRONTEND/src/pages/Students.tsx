import React, { useState, useMemo, useEffect } from 'react';
import { 
    AcademicCapIcon, UserIcon, BriefcaseIcon, MagnifyingGlassIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// --- 1. INTERFACES & MOCK DATA SETUP ---

interface Student {
    id: number;
    name: string;
    branch: 'CSE' | 'ECE' | 'EEE' | 'IT' | 'Mech' | 'Civil';
    cgpa: number;
    credits: number; // Credits completed
    contact: string;
    email: string;
    placementStatus: 'Hired' | 'Seeking' | 'Internship' | 'Not Eligible';
    // Summary of applications and feedback (for quick view)
    totalApplications: number;
    offersReceived: number;
    averageRating: number;
}

const mockStudents: Student[] = [
    { id: 1, name: 'Alice Johnson', branch: 'CSE', cgpa: 9.1, credits: 120, contact: '555-0101', email: 'alice@college.edu', placementStatus: 'Hired', totalApplications: 5, offersReceived: 1, averageRating: 4.5 },
    { id: 2, name: 'Bob Williams', branch: 'ECE', cgpa: 8.5, credits: 110, contact: '555-0102', email: 'bob@college.edu', placementStatus: 'Seeking', totalApplications: 3, offersReceived: 0, averageRating: 3.0 },
    { id: 3, name: 'Charlie Brown', branch: 'CSE', cgpa: 7.8, credits: 90, contact: '555-0103', email: 'charlie@college.edu', placementStatus: 'Seeking', totalApplications: 8, offersReceived: 0, averageRating: 4.0 },
    { id: 4, name: 'Diana Prince', branch: 'IT', cgpa: 6.9, credits: 100, contact: '555-0104', email: 'diana@college.edu', placementStatus: 'Not Eligible', totalApplications: 1, offersReceived: 0, averageRating: 2.0 },
    { id: 5, name: 'Eve Adams', branch: 'CSE', cgpa: 9.5, credits: 130, contact: '555-0105', email: 'eve@college.edu', placementStatus: 'Hired', totalApplications: 7, offersReceived: 2, averageRating: 5.0 },
    { id: 6, name: 'Frank White', branch: 'EEE', cgpa: 8.2, credits: 115, contact: '555-0106', email: 'frank@college.edu', placementStatus: 'Seeking', totalApplications: 4, offersReceived: 0, averageRating: 3.5 },
    { id: 7, name: 'Grace Lee', branch: 'ECE', cgpa: 7.1, credits: 95, contact: '555-0107', email: 'grace@college.edu', placementStatus: 'Seeking', totalApplications: 6, offersReceived: 0, averageRating: 4.0 },
    { id: 8, name: 'Harry Wilson', branch: 'IT', cgpa: 8.8, credits: 125, contact: '555-0108', email: 'harry@college.edu', placementStatus: 'Hired', totalApplications: 4, offersReceived: 1, averageRating: 4.8 },
    { id: 9, name: 'Ivy Davis', branch: 'Mech', cgpa: 7.5, credits: 105, contact: '555-0109', email: 'ivy@college.edu', placementStatus: 'Internship', totalApplications: 2, offersReceived: 1, averageRating: 3.2 },
    { id: 10, name: 'Jack Miller', branch: 'CSE', cgpa: 8.9, credits: 118, contact: '555-0110', email: 'jack@college.edu', placementStatus: 'Seeking', totalApplications: 10, offersReceived: 0, averageRating: 4.1 },
    { id: 11, name: 'Karen Clark', branch: 'IT', cgpa: 9.3, credits: 135, contact: '555-0111', email: 'karen@college.edu', placementStatus: 'Hired', totalApplications: 5, offersReceived: 1, averageRating: 4.6 },
    { id: 12, name: 'Liam Green', branch: 'Civil', cgpa: 6.5, credits: 98, contact: '555-0112', email: 'liam@college.edu', placementStatus: 'Not Eligible', totalApplications: 2, offersReceived: 0, averageRating: 2.5 },
    { id: 13, name: 'Mia Hall', branch: 'CSE', cgpa: 8.0, credits: 122, contact: '555-0113', email: 'mia@college.edu', placementStatus: 'Seeking', totalApplications: 6, offersReceived: 0, averageRating: 3.9 },
    { id: 14, name: 'Noah King', branch: 'ECE', cgpa: 7.9, credits: 108, contact: '555-0114', email: 'noah@college.edu', placementStatus: 'Seeking', totalApplications: 3, offersReceived: 0, averageRating: 3.4 },
];

const ITEMS_PER_PAGE = 6;

// --- 2. HELPER COMPONENTS ---

// Status Badge Component
const PlacementStatusBadge = ({ status }: { status: Student['placementStatus'] }) => {
    let classes = '';
    switch (status) {
        case 'Hired': classes = 'bg-teal-100 text-teal-700'; break;
        case 'Seeking': classes = 'bg-indigo-100 text-indigo-700'; break;
        case 'Internship': classes = 'bg-amber-100 text-amber-700'; break;
        case 'Not Eligible': classes = 'bg-red-100 text-red-700'; break;
    }
    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${classes}`}>
            {status}
        </span>
    );
};

// Rating Stars Component
const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    // Removed unused variable hasHalfStar
    
    return (
        <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
                <StarIcon
                    key={i}
                    className={`w-4 h-4 mr-0.5 ${
                        i < fullStars 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                    }`}
                />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
        </div>
    );
};


// --- 3. MAIN COMPONENT ---

const Students: React.FC = () => {
    // FIX: Ensure all React hooks (useState, useMemo, useEffect) are correctly used and imported.
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBranch, setFilterBranch] = useState<'All' | Student['branch']>('All');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and Sort Students
    const filteredStudents = useMemo(() => {
        let results = mockStudents;

        if (filterBranch !== 'All') {
            results = results.filter(s => s.branch === filterBranch);
        }

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(s => 
                s.name.toLowerCase().includes(lowerCaseSearch) ||
                s.email.toLowerCase().includes(lowerCaseSearch) ||
                s.branch.toLowerCase().includes(lowerCaseSearch)
            );
        }
        
        // Sort by CGPA descending for directory relevance
        return results.sort((a, b) => b.cgpa - a.cgpa);
    }, [searchTerm, filterBranch]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const currentStudents = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredStudents.slice(start, end);
    }, [filteredStudents, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    // Available Branches for Filter
    const branches = useMemo(() => {
        const uniqueBranches = Array.from(new Set(mockStudents.map(s => s.branch))).sort();
        return ['All', ...uniqueBranches] as ('All' | Student['branch'])[];
    }, []);

    // If the selected student is filtered out, clear the selection
    useEffect(() => {
        if (selectedStudent && !filteredStudents.some(s => s.id === selectedStudent.id)) {
            setSelectedStudent(null);
        }
    }, [filteredStudents, selectedStudent]);


    // Component Structure
    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <UserIcon className="w-10 h-10 text-indigo-600 mr-4"/> Student Profile Directory
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                        Quickly access and review detailed academic, application, and feedback summaries for all students.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: Student List & Search/Filter --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Student Roster ({filteredStudents.length})</h2>
                            
                            {/* Search and Filter Controls */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name, email, or branch..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                
                                <select
                                    value={filterBranch}
                                    onChange={(e) => { setFilterBranch(e.target.value as 'All' | Student['branch']); setCurrentPage(1); }}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                >
                                    {branches.map(branch => (
                                        <option key={branch} value={branch}>
                                            {branch === 'All' ? 'All Branches' : branch}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Student List */}
                            <div className="divide-y divide-gray-100">
                                {currentStudents.map((student) => (
                                    <div 
                                        key={student.id} 
                                        className={`flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg transition duration-150 ${
                                            selectedStudent?.id === student.id ? 'bg-indigo-50 shadow-inner' : ''
                                        }`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-indigo-100 rounded-full">
                                                <UserIcon className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-6">
                                            <p className="text-sm font-medium text-gray-700">{student.branch}</p>
                                            <p className="text-lg font-bold text-gray-900">{student.cgpa.toFixed(2)}</p>
                                            <PlacementStatusBadge status={student.placementStatus} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-600">
                                    Showing {Math.min(ITEMS_PER_PAGE, currentStudents.length)} of {filteredStudents.length} results
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    <span className="py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Selected Student Detail Card (Sticky) --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            {selectedStudent ? (
                                <div className="bg-white p-6 rounded-xl shadow-2xl border border-indigo-100">
                                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">{selectedStudent.name}'s Profile</h2>
                                    
                                    <div className="space-y-4">
                                        
                                        {/* Academic Info */}
                                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                            <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Branch / CGPA</p>
                                                <p className="text-lg font-bold text-gray-900">{selectedStudent.branch} | {selectedStudent.cgpa.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Placement Status */}
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 flex items-center">
                                                <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-500" /> Current Placement Status
                                            </p>
                                            <div className="mt-1">
                                                <PlacementStatusBadge status={selectedStudent.placementStatus} />
                                            </div>
                                        </div>
                                        
                                        {/* Application Summary */}
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-3xl font-bold text-green-700">{selectedStudent.offersReceived}</p>
                                                <p className="text-sm text-green-600">Offers Received</p>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-lg">
                                                <p className="text-3xl font-bold text-indigo-700">{selectedStudent.totalApplications}</p>
                                                <p className="text-sm text-indigo-600">Total Applications</p>
                                            </div>
                                        </div>

                                        {/* Feedback Summary */}
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 flex items-center mb-1">
                                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-yellow-600" /> Average Mentor Rating
                                            </p>
                                            <RatingStars rating={selectedStudent.averageRating} />
                                        </div>

                                        {/* Contact Info */}
                                        <div className="pt-4 border-t border-gray-100 text-sm space-y-1">
                                            <p><span className="font-semibold text-gray-700">Email:</span> {selectedStudent.email}</p>
                                            <p><span className="font-semibold text-gray-700">Contact:</span> {selectedStudent.contact}</p>
                                            <p><span className="font-semibold text-gray-700">Credits Completed:</span> {selectedStudent.credits}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center text-gray-500 h-96 flex items-center justify-center">
                                    <p>Select a student from the list to view their detailed profile.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Students;
