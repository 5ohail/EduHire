import React from 'react';
import { Link } from 'react-router-dom';

// 1. Define the TypeScript interface for an Application
interface Application {
  id: number;
  title: string;
  applicationDate: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Hired';
}

// 2. Sample Data based on the image
const applicationsData: Application[] = [
  {
    id: 1,
    title: 'Product Management Intern',
    applicationDate: '2023-08-15',
    status: 'Applied',
  },
  {
    id: 2,
    title: 'Marketing Intern',
    applicationDate: '2023-08-20',
    status: 'Under Review',
  },
  {
    id: 3,
    title: 'Software Engineering Intern',
    applicationDate: '2023-08-26',
    status: 'Interview',
  },
  {
    id: 4,
    title: 'Data Analysis Intern',
    applicationDate: '2023-09-01',
    status: 'Rejected',
  },
  {
    id: 5,
    title: 'UI/UX Design Intern',
    applicationDate: '2023-09-05',
    status: 'Hired',
  },
];

// 3. Helper function to determine status badge styles
const getStatusClasses = (status: Application['status']): string => {
  switch (status) {
    case 'Applied':
      // Close match to the applied blue/purple
      return 'bg-indigo-100 text-indigo-700';
    case 'Under Review':
      // Close match to the under review yellow/brown
      return 'bg-amber-100 text-amber-700';
    case 'Interview':
      // Close match to the interview green
      return 'bg-emerald-100 text-emerald-700';
    case 'Rejected':
      // Close match to the rejected red/pink
      return 'bg-red-100 text-red-700';
    case 'Hired':
      // Close match to the hired teal/green
      return 'bg-teal-100 text-teal-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// 4. The main React component
const Applications: React.FC = () => {
  return (
    // Outer container for the pale background color
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-normal text-gray-900 mb-8 tracking-tight">
          My Applications
        </h1>

        {/* Main Card/Container */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Table Header Row */}
          <div className="grid grid-cols-[3fr_1.5fr_1fr_0.3fr] text-xs font-medium text-gray-400 border-b border-b-gray-300 py-4 px-6 tracking-wider uppercase">
            <div>Internship Title</div>
            <div>Application Date</div>
            <div>Status</div>
            <div></div> {/* For the 'View' link */}
          </div>

          {/* List of Applications */}
          <div>
            {applicationsData.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-[3fr_1.5fr_1fr_0.3fr] items-center py-4 px-6 border-b border-b-gray-300 last:border-b-0 text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                {/* Internship Title */}
                <div className="text-sm font-medium">
                  {app.title}
                </div>

                {/* Application Date */}
                <div className="text-sm">
                  {app.applicationDate}
                </div>

                {/* Status Badge */}
                <div className="flex">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-md w-fit ${getStatusClasses(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* View Link (Red color matching the image) */}
                <div className="text-right">
                  <Link
                    to={`/applications/${app.id}`} // Placeholder link
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;