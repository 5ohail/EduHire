import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// --- Data Structure for a Student Record ---
interface Student {
    id: string;
    name: string;
    collegeId: string;
    major: string;
    graduationYear: number;
    profileStatus: 'Complete' | 'Draft' | 'Needs Review';
    applicationsCount: number;
}

// --- Sample Student Data ---
const studentsData: Student[] = [
    {
        id: 'std001',
        name: 'Aisha Sharma',
        collegeId: '2023CS001',
        major: 'Computer Science',
        graduationYear: 2026,
        profileStatus: 'Complete',
        applicationsCount: 7,
    },
    {
        id: 'std002',
        name: 'Rohan Patel',
        collegeId: '2024ME045',
        major: 'Mechanical Engineering',
        graduationYear: 2027,
        profileStatus: 'Needs Review',
        applicationsCount: 2,
    },
    {
        id: 'std003',
        name: 'Priya Verma',
        collegeId: '2023EE012',
        major: 'Electrical Engineering',
        graduationYear: 2026,
        profileStatus: 'Complete',
        applicationsCount: 15,
    },
    {
        id: 'std004',
        name: 'Vikram Singh',
        collegeId: '2025CE005',
        major: 'Civil Engineering',
        graduationYear: 2028,
        profileStatus: 'Draft',
        applicationsCount: 0,
    },
];

// --- Status Badge Helper ---
const getStatusClasses = (status: Student['profileStatus']): string => {
    switch (status) {
        case 'Complete':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'Needs Review':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'Draft':
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

// --- Main Component ---
const StudentDirectoryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Simple filter logic for demo
    const filteredStudents = studentsData.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.collegeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                
                {/* Page Header */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Student Directory
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Review and manage all student profiles and application activity.
                </p>

                {/* --- Search and Filter Bar --- */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by name or college ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filter Button (e.g., filter by major or graduation year) */}
                    <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition">
                        <FunnelIcon className="w-5 h-5 mr-2" />
                        Filter Students
                    </button>
                </div>
                {/* ------------------------------- */}

                {/* Main Table Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    
                    {/* Table Structure */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            
                            {/* Table Header */}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        College ID / Major
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Profile Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applications
                                    </th>
                                    <th className="relative px-6 py-4">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            
                            {/* Table Body */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition">
                                        {/* Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <UserCircleIcon className="h-8 w-8 text-indigo-400 mr-3" />
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.name}
                                                    <p className="text-xs text-gray-500 mt-0.5">Grad Year: {student.graduationYear}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* College ID / Major */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.collegeId}</div>
                                            <div className="text-sm text-gray-500">{student.major}</div>
                                        </td>
                                        
                                        {/* Profile Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(student.profileStatus)}`}
                                            >
                                                {student.profileStatus}
                                            </span>
                                        </td>
                                        
                                        {/* Applications Count */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.applicationsCount} active
                                        </td>
                                        
                                        {/* Action Button */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link 
                                                to={`/mentor/students/${student.id}`} // Link to the student's full detail page
                                                className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                            >
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-600">
                        <span>Showing 1 to 4 of 42 students</span>
                        <div>
                            <button className="px-3 py-1 mx-1 border rounded-md hover:bg-gray-100">Previous</button>
                            <button className="px-3 py-1 mx-1 border rounded-md bg-indigo-500 text-white">1</button>
                            <button className="px-3 py-1 mx-1 border rounded-md hover:bg-gray-100">2</button>
                            <button className="px-3 py-1 mx-1 border rounded-md hover:bg-gray-100">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDirectoryPage;