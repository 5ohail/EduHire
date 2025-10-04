import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
// --- CHART.JS IMPORTS FOR BAR CHART ---
import { Bar } from 'react-chartjs-2'; 
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
// Register the necessary elements for the Bar chart
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend
);
// ------------------------------------

// 1. Define the TypeScript interface for an Application
interface Application {
  id: number;
  title: string;
  applicationDate: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Hired';
}

// 2. Sample Data
const applicationsData: Application[] = [
  { id: 1, title: 'Product Management Intern', applicationDate: '2023-08-15', status: 'Applied' },
  { id: 2, title: 'Marketing Intern', applicationDate: '2023-08-20', status: 'Under Review' },
  { id: 3, title: 'Software Engineering Intern', applicationDate: '2023-08-26', status: 'Interview' },
  { id: 4, title: 'Data Analysis Intern', applicationDate: '2023-09-01', status: 'Rejected' },
  { id: 5, title: 'UI/UX Design Intern', applicationDate: '2023-09-05', status: 'Hired' },
];

// 3. Helper function to determine status badge styles
const getStatusClasses = (status: Application['status']): string => {
  switch (status) {
    case 'Applied': return 'bg-indigo-100 text-indigo-700';
    case 'Under Review': return 'bg-amber-100 text-amber-700';
    case 'Interview': return 'bg-emerald-100 text-emerald-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    case 'Hired': return 'bg-teal-100 text-teal-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// --- NEW COMPONENTS & LOGIC FOR DASHBOARD ---

interface StatusCardProps {
  title: string;
  value: number;
  className: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, className }) => (
  <div className={`p-5 rounded-lg shadow-md ${className}`}>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
  </div>
);

// Function to generate data for Chart.js
const generateChartData = (data: Application[]) => {
  const statusCounts: Record<Application['status'], number> = {
    Applied: 0,
    'Under Review': 0,
    Interview: 0,
    Rejected: 0,
    Hired: 0,
  };

  data.forEach(app => {
    statusCounts[app.status] += 1;
  });

  // Define colors (matching your Tailwind 500 shades for consistency)
  const colors = [
    '#6366f1', // Indigo (Applied)
    '#f59e0b', // Amber (Under Review)
    '#10b981', // Emerald (Interview)
    '#ef4444', // Red (Rejected)
    '#14b8a6', // Teal (Hired)
  ];
  
  const statusOrder: Application['status'][] = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'];

  return {
    labels: statusOrder,
    datasets: [
      {
        label: 'Number of Applications',
        data: statusOrder.map(status => statusCounts[status]),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container height
    plugins: {
        legend: {
            display: false, // Legend not necessary for a single-dataset bar chart
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            // Force Y-axis to display only whole numbers (counts)
            ticks: {
                stepSize: 1,
                precision: 0,
            },
            beginAtZero: true,
        },
    },
};


// 4. The main React component
const StudentApplications: React.FC = () => {
  
  const chartData = useMemo(() => generateChartData(applicationsData), []);

  const totalApplications = applicationsData.length;
  const applicationsUnderReview = applicationsData.filter(
    (app) => app.status === 'Under Review'
  ).length;

  return (
    // Outer container for the pale background color
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-normal text-gray-900 mb-8 tracking-tight">
          My Applications Dashboard
        </h1>

        {/* --- Dashboard Section with Chart --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Summary Cards */}
          <div className="lg:col-span-1 space-y-4">
            <StatusCard
              title="Total Applications"
              value={totalApplications}
              className="bg-white border border-gray-200"
            />
            <StatusCard
              title="Awaiting Response (Under Review)"
              value={applicationsUnderReview}
              className="bg-amber-50 border border-amber-200"
            />
          </div>

          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4 border-b pb-3 text-gray-700">
              Application Status Distribution
            </h2>
            <div className="h-64 flex items-center justify-center">
              {/* --- BAR CHART IMPLEMENTATION --- */}
              <Bar data={chartData} options={chartOptions} />
              {/* ---------------------------------- */}
            </div>
          </div>
        </div>
        {/* -------------------------------------- */}
        
        <h2 className="text-2xl font-normal text-gray-800 mb-4 mt-8 tracking-tight">
            Application Log
        </h2>

        {/* Main Card/Container for the Table */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Table Header Row */}
          <div className="grid grid-cols-[3fr_1.5fr_1fr_0.3fr] text-xs font-medium text-gray-400 border-b border-b-gray-300 py-4 px-6 tracking-wider uppercase">
            <div>Internship Title</div>
            <div>Application Date</div>
            <div>Status</div>
            <div></div>
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
                    to={`/applications/${app.id}`}
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

export default StudentApplications;