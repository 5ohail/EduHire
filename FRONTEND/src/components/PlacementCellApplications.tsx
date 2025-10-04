import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'; 
import { BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';

// Register the necessary elements for both Bar and Doughnut charts
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Tooltip, 
  Legend
);

// --- 1. Define the TypeScript interface for an Application ---
interface StudentApplication {
  id: number;
  studentName: string;
  studentBranch: 'CSE' | 'ECE' | 'EEE' | 'IT' | 'Mech' | 'Civil';
  jobTitle: string;
  company: string;
  applicationDate: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Hired';
  jobType: 'Full-time' | 'Internship';
}

// --- 2. Sample Data ---
const studentApplicationsData: StudentApplication[] = [
  { id: 1, studentName: 'Alice Johnson', studentBranch: 'CSE', jobTitle: 'Software Engineer Intern', company: 'Tech Innovators', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
  { id: 2, studentName: 'Bob Williams', studentBranch: 'ECE', jobTitle: 'Hardware Design Intern', company: 'ElectroTech', applicationDate: '2023-09-28', status: 'Applied', jobType: 'Internship' },
  { id: 3, studentName: 'Charlie Brown', studentBranch: 'CSE', jobTitle: 'Full Stack Developer', company: 'Web Solutions', applicationDate: '2023-10-05', status: 'Interview', jobType: 'Full-time' },
  { id: 4, studentName: 'Diana Prince', studentBranch: 'IT', jobTitle: 'Data Analyst', company: 'Data Insights', applicationDate: '2023-09-20', status: 'Rejected', jobType: 'Full-time' },
  { id: 5, studentName: 'Eve Adams', studentBranch: 'CSE', jobTitle: 'Software Engineer', company: 'Global Apps', applicationDate: '2023-09-15', status: 'Hired', jobType: 'Full-time' },
  { id: 6, studentName: 'Frank White', studentBranch: 'EEE', jobTitle: 'Power Systems Intern', company: 'Energy Co', applicationDate: '2023-10-10', status: 'Applied', jobType: 'Internship' },
  { id: 7, studentName: 'Grace Lee', studentBranch: 'ECE', jobTitle: 'Embedded Systems Engineer', company: 'Robotics Inc', applicationDate: '2023-09-25', status: 'Under Review', jobType: 'Full-time' },
  { id: 8, studentName: 'Harry Wilson', studentBranch: 'IT', jobTitle: 'Cybersecurity Analyst', company: 'SecureNet', applicationDate: '2023-10-02', status: 'Interview', jobType: 'Full-time' },
  { id: 9, studentName: 'Ivy Davis', studentBranch: 'Mech', jobTitle: 'Mechanical Design Intern', company: 'Auto Industries', applicationDate: '2023-09-30', status: 'Applied', jobType: 'Internship' },
  { id: 10, studentName: 'Jack Miller', studentBranch: 'CSE', jobTitle: 'DevOps Engineer', company: 'Cloud Solutions', applicationDate: '2023-10-08', status: 'Under Review', jobType: 'Full-time' },
  { id: 11, studentName: 'Karen Clark', studentBranch: 'IT', jobTitle: 'Web Developer', company: 'Digital Agency', applicationDate: '2023-09-18', status: 'Interview', jobType: 'Full-time' },
  { id: 12, studentName: 'Liam Green', studentBranch: 'Civil', jobTitle: 'Site Engineer Intern', company: 'Buildwell Constr', applicationDate: '2023-10-03', status: 'Rejected', jobType: 'Internship' },
  { id: 13, studentName: 'Mia Hall', studentBranch: 'CSE', jobTitle: 'AI/ML Engineer', company: 'Cognitive AI', applicationDate: '2023-09-12', status: 'Hired', jobType: 'Full-time' },
  { id: 14, studentName: 'Noah King', studentBranch: 'ECE', jobTitle: 'RF Engineer', company: 'Telecom Solutions', applicationDate: '2023-10-07', status: 'Applied', jobType: 'Full-time' },
  { id: 15, studentName: 'Olivia Scott', studentBranch: 'CSE', jobTitle: 'Frontend Developer Intern', company: 'Innovatech Solutions', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
  { id: 16, studentName: 'Peter B. Parker', studentBranch: 'IT', jobTitle: 'Software Engineer', company: 'Daily Bugle Tech', applicationDate: '2023-10-02', status: 'Hired', jobType: 'Full-time' },
];

// --- 3. Helper function to determine status badge styles (re-used) ---
const getStatusClasses = (status: StudentApplication['status']): string => {
  switch (status) {
    case 'Applied': return 'bg-indigo-100 text-indigo-700';
    case 'Under Review': return 'bg-amber-100 text-amber-700';
    case 'Interview': return 'bg-emerald-100 text-emerald-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    case 'Hired': return 'bg-teal-100 text-teal-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// --- Summary Card Component ---
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-full ${color} text-white`}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-500">{title.toUpperCase()}</span>
    </div>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);


// --- Chart Data Generators and Options ---
const chartColors = {
  status: {
    Applied: '#6b70f0',      // Indigo
    'Under Review': '#facc15', // Amber
    Interview: '#34d399',   // Emerald
    Rejected: '#f87171',    // Red
    Hired: '#2dd4bf',       // Teal
  },
  branch: {
    CSE: '#4f46e5',
    ECE: '#eab308',
    EEE: '#ef4444',
    IT: '#14b8a6',
    Mech: '#0d9488',
    Civil: '#c026d3',
  },
  jobType: {
    'Full-time': '#8b5cf6', 
    Internship: '#a855f7',
  }
};

// --- LIGHT THEME STYLES (Updated to be lighter) ---
const lightChartBackgroundColor = '#ffffff'; // White for chart background



// --- Data Aggregation Logic (Modified to remove gradient) ---
const generateChartData = (data: StudentApplication[]) => {
    const statusCounts: Record<StudentApplication['status'], number> = {
      Applied: 0, 'Under Review': 0, Interview: 0, Rejected: 0, Hired: 0,
    };
    const branchCounts: Record<StudentApplication['studentBranch'], number> = {
      CSE: 0, ECE: 0, EEE: 0, IT: 0, Mech: 0, Civil: 0,
    };
    const jobTypeCounts: Record<StudentApplication['jobType'], number> = {
      'Full-time': 0, Internship: 0,
    };

    let hired = 0;

    data.forEach(app => {
      statusCounts[app.status] += 1;
      branchCounts[app.studentBranch] += 1;
      jobTypeCounts[app.jobType] += 1;
      if (app.status === 'Hired') hired++;
    });

    const statusLabels: (keyof typeof statusCounts)[] = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'];
    const branchLabels: (keyof typeof branchCounts)[] = ['CSE', 'ECE', 'EEE', 'IT', 'Mech', 'Civil'];
    const jobTypeLabels: (keyof typeof jobTypeCounts)[] = ['Full-time', 'Internship'];

    // --- Bar Chart Data for Status (SOLID COLOR) ---
    const statusData = {
      labels: statusLabels,
      datasets: [{
        label: 'Applications',
        data: statusLabels.map(status => statusCounts[status]),
        backgroundColor: statusLabels.map(status => chartColors.status[status]), // Solid color
        borderColor: statusLabels.map(status => chartColors.status[status]),
        borderWidth: 1, borderRadius: 8,
        hoverBackgroundColor: statusLabels.map(status => chartColors.status[status]),
      }],
    };

    // --- Bar Chart Data for Branch (SOLID COLOR) ---
    const branchData = {
      labels: branchLabels,
      datasets: [{
        label: 'Applications by Branch',
        data: branchLabels.map(branch => branchCounts[branch]),
        backgroundColor: branchLabels.map(branch => chartColors.branch[branch]), // Solid color
        borderColor: branchLabels.map(branch => chartColors.branch[branch]),
        borderWidth: 1, borderRadius: 8,
        hoverBackgroundColor: branchLabels.map(branch => chartColors.branch[branch]),
      }],
    };

    // --- Doughnut Chart Data for Job Type (SOLID COLOR) ---
    const jobTypeData = {
      labels: jobTypeLabels,
      datasets: [{
        label: 'Job Types',
        data: jobTypeLabels.map(type => jobTypeCounts[type]),
        backgroundColor: jobTypeLabels.map(type => chartColors.jobType[type]), // Solid color
        borderColor: lightChartBackgroundColor, // Ensure the border is light (white)
        borderWidth: 4, // Increased border for better separation on light background
        hoverOffset: 4,
      }],
    };

    return {
      statusChartData: statusData,
      branchChartData: branchData,
      jobTypeDoughnutData: jobTypeData,
      totalApplications: studentApplicationsData.length,
      underReviewCount: statusCounts['Under Review'],
      hiredCount: hired,
    };
};

// --- Main Component ---
const PlacementCellApplications: React.FC = () => {

  const { 
    statusChartData, 
    branchChartData, 
    jobTypeDoughnutData, 
    totalApplications, 
    underReviewCount, 
    hiredCount 
  } = useMemo(() => generateChartData(studentApplicationsData), []);

  // Tailwind classes for the chart container - now light and using the same white background as the chart data
  const lightChartCardClasses = `bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-200`;


  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Placement Cell Application Tracker
        </h1>

        {/* --- Summary Cards Section (Remains Light) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummaryCard 
            title="Total Applications" 
            value={totalApplications} 
            icon={<BriefcaseIcon className="w-6 h-6" />} 
            color="bg-indigo-600" 
          />
          <SummaryCard 
            title="Under Review" 
            value={underReviewCount} 
            icon={<AcademicCapIcon className="w-6 h-6" />} 
            color="bg-amber-500" 
          />
          <SummaryCard 
            title="Successfully Placed" 
            value={hiredCount} 
            icon={<CheckCircleIcon className="w-6 h-6" />} 
            color="bg-teal-600" 
          />
        </div>

        {/* --- Charts Section (LIGHT, SOLID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Applications by Status Bar Chart */}
          <div className={lightChartCardClasses}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 text-indigo-600 mr-3"/> Applications by Status
            </h2>
            <div className="h-72">
              <Bar data={statusChartData} />
            </div>
          </div>

          {/* Applications by Branch Bar Chart */}
          <div className={lightChartCardClasses}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 text-emerald-600 mr-3"/> Applications by Branch
            </h2>
            <div className="h-72">
              <Bar data={branchChartData}  />
            </div>
          </div>
        </div>

        {/* --- Job Type Doughnut Chart (LIGHT, SOLID) --- */}
        <div className={lightChartCardClasses}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
                <ChartPieIcon className="w-6 h-6 text-purple-600 mr-3"/> Application Breakdown by Job Type
            </h2>
            <div className="h-72 max-w-xl mx-auto">
                <Doughnut data={jobTypeDoughnutData}/>
            </div>
        </div>

        {/* --- Applications Table Section (Remains Light) --- */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-12 tracking-tight">
          All Student Applications
        </h2>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="grid grid-cols-7 text-sm font-medium text-gray-500 border-b border-gray-200 py-4 px-8 tracking-wider uppercase bg-gray-50">
            <div>Student Name</div>
            <div>Branch</div>
            <div>Job Title</div>
            <div>Company</div>
            <div>Applied On</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div>
            {studentApplicationsData.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-7 items-center py-4 px-8 border-b border-gray-100 last:border-b-0 text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                <div className="text-base font-medium">{app.studentName}</div>
                <div className="text-base">{app.studentBranch}</div>
                <div className="text-base">{app.jobTitle}</div>
                <div className="text-base">{app.company}</div>
                <div className="text-sm text-gray-600">{app.applicationDate}</div>
                <div className="flex">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full w-fit ${getStatusClasses(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <div className="text-right">
                  <Link
                    to={`/applications/${app.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200"
                  >
                    View Details
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

export default PlacementCellApplications;