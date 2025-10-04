import React, { useState, useMemo } from 'react';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    ArcElement,
    Tooltip, 
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; 
import { 
    BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, ChartBarIcon, FunnelIcon, UserGroupIcon, XCircleIcon, CheckBadgeIcon
} from '@heroicons/react/24/outline';

// Register Chart.js elements
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    ArcElement,
    Tooltip, 
    Legend
);

// --- 1. INTERFACES & SAMPLE DATA ---

interface StudentApplication {
    id: number;
    studentName: string;
    studentBranch: 'CSE' | 'ECE' | 'EEE' | 'IT' | 'Mech' | 'Civil';
    cgpa: number;
    jobTitle: string;
    company: string;
    status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Hired';
    jobType: 'Full-time' | 'Internship';
}

const initialStudentApplicationsData: StudentApplication[] = [
    { id: 1, studentName: 'Alice Johnson', studentBranch: 'CSE', cgpa: 9.1, jobTitle: 'Software Engineer Intern', company: 'Innovatech', status: 'Under Review', jobType: 'Internship' },
    { id: 2, studentName: 'Bob Williams', studentBranch: 'ECE', cgpa: 8.5, jobTitle: 'Hardware Engineer', company: 'ElectroTech', status: 'Applied', jobType: 'Full-time' },
    { id: 3, studentName: 'Charlie Brown', studentBranch: 'CSE', cgpa: 7.8, jobTitle: 'Full Stack Developer', company: 'Web Solutions', status: 'Interview', jobType: 'Full-time' },
    { id: 4, studentName: 'Diana Prince', studentBranch: 'IT', cgpa: 6.9, jobTitle: 'Data Analyst', company: 'Data Insights', status: 'Rejected', jobType: 'Full-time' },
    { id: 5, studentName: 'Eve Adams', studentBranch: 'CSE', cgpa: 9.5, jobTitle: 'Software Engineer', company: 'Global Apps', status: 'Hired', jobType: 'Full-time' },
    { id: 6, studentName: 'Frank White', studentBranch: 'EEE', cgpa: 8.2, jobTitle: 'Power Systems Intern', company: 'Energy Co', status: 'Applied', jobType: 'Internship' },
    { id: 7, studentName: 'Grace Lee', studentBranch: 'ECE', cgpa: 7.1, jobTitle: 'Embedded Systems Engineer', company: 'Robotics Inc', status: 'Interview', jobType: 'Full-time' },
    { id: 8, studentName: 'Harry Wilson', studentBranch: 'IT', cgpa: 8.8, jobTitle: 'Cybersecurity Analyst', company: 'SecureNet', status: 'Hired', jobType: 'Full-time' },
    { id: 9, studentName: 'Ivy Davis', studentBranch: 'Mech', cgpa: 7.5, jobTitle: 'Mechanical Design Intern', company: 'Auto Industries', status: 'Under Review', jobType: 'Internship' },
    { id: 10, studentName: 'Jack Miller', studentBranch: 'CSE', cgpa: 8.9, jobTitle: 'DevOps Engineer', company: 'Cloud Solutions', status: 'Interview', jobType: 'Full-time' },
    { id: 11, studentName: 'Karen Clark', studentBranch: 'IT', cgpa: 9.3, jobTitle: 'Web Developer', company: 'Digital Agency', status: 'Hired', jobType: 'Full-time' },
];

// --- 2. CHART CONFIGURATION ---

const chartColors = {
    status: { Applied: '#6b70f0', 'Under Review': '#facc15', Interview: '#34d399', Rejected: '#f87171', Hired: '#2dd4bf' },
    branch: { CSE: '#4f46e5', ECE: '#eab308', EEE: '#ef4444', IT: '#14b8a6', Mech: '#0d9488', Civil: '#c026d3' }
};

const lightGridColor = '#e5e7eb'; 
const lightTextColor = '#374151'; 

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' as const, labels: { color: lightTextColor, usePointStyle: true } },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            titleColor: lightTextColor, 
            bodyColor: lightTextColor,
            borderColor: lightGridColor,
            borderWidth: 1,
            cornerRadius: 8,
        },
    },
    scales: {
        x: { grid: { display: false, drawBorder: false }, ticks: { color: lightTextColor } },
        y: { 
            grid: { color: lightGridColor, drawBorder: false }, 
            ticks: { stepSize: 1, precision: 0, color: lightTextColor }, 
            beginAtZero: true 
        },
    },
    animation: { duration: 800 } as any, 
};

// --- 3. HELPER COMPONENTS ---

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition duration-300">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
                {icon}
            </div>
            <span className="text-sm font-semibold text-gray-500">{title.toUpperCase()}</span>
        </div>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
);

// Status Badge Component
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

// --- 4. DATA AGGREGATION LOGIC ---

const analyzeApplicationData = (data: StudentApplication[]) => {
    const totalApplications = data.length;
    const statusCounts: Record<StudentApplication['status'], number> = { 
        Applied: 0, 'Under Review': 0, Interview: 0, Rejected: 0, Hired: 0 
    };
    const branchApplications: Record<string, number> = {};
    const branchHired: Record<string, number> = {};
    let totalHired = 0;
    let totalInterviewed = 0;

    data.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        
        if (app.status === 'Hired') totalHired++;
        if (app.status === 'Interview' || app.status === 'Hired') totalInterviewed++;

        branchApplications[app.studentBranch] = (branchApplications[app.studentBranch] || 0) + 1;
        if (app.status === 'Hired') {
            branchHired[app.studentBranch] = (branchHired[app.studentBranch] || 0) + 1;
        }
    });

    const branches = Object.keys(branchApplications) as StudentApplication['studentBranch'][];
    
    // Calculate Interview Rate (Interviews + Hired) / Total Applications
    const interviewRate = totalApplications > 0 ? ((totalInterviewed / totalApplications) * 100).toFixed(1) : '0.0';
    
    // --- Chart Data Generation ---

    // 1. Application Status Pipeline (Bar Chart)
    const statusLabels: (keyof typeof statusCounts)[] = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'];
    const statusChartData = {
        labels: statusLabels,
        datasets: [{
            label: 'Application Count',
            data: statusLabels.map(status => statusCounts[status]),
            backgroundColor: statusLabels.map(status => chartColors.status[status]),
            borderRadius: 6,
        }],
    };

    // FIX: Ensure branch is treated as a key of chartColors.branch, and append string correctly.
    // 2. Branch Performance (Bar Chart: Hired vs. Total Applicants)
    const branchPerformanceData = {
        labels: branches,
        datasets: [
            {
                label: 'Total Applicants',
                data: branches.map(branch => branchApplications[branch]),
                backgroundColor: branches.map(branch => chartColors.branch[branch] + '99'), // Use string concatenation for transparency
                borderColor: branches.map(branch => chartColors.branch[branch]),
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Hired Students',
                data: branches.map(branch => branchHired[branch] || 0),
                backgroundColor: '#2dd4bf', // Teal for hired
                borderRadius: 4,
            }
        ],
    };


    return {
        totalApplications,
        totalHired,
        interviewRate,
        statusChartData,
        branchPerformanceData,
        statusCounts,
    };
};


// --- 5. MAIN COMPONENT ---

// FIX: Renamed export component to match the file's purpose and previous context
const StudentApplicationTracker: React.FC = () => {
    // Use local state for applications so we can modify statuses
    const [applications, setApplications] = useState<StudentApplication[]>(initialStudentApplicationsData);
    const [filterStatus, setFilterStatus] = useState<StudentApplication['status'] | 'All'>('All');
    
    // Process data based on current state of applications
    const { 
        totalApplications, totalHired, interviewRate, statusChartData, branchPerformanceData, statusCounts 
    } = useMemo(() => analyzeApplicationData(applications), [applications]);

    // Function to update the status of an application
    const handleStatusUpdate = (id: number, newStatus: StudentApplication['status']) => {
        setApplications(prevApplications =>
            prevApplications.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            )
        );
    };

    // Filter the table data based on the selected status tab
    const filteredTableData = useMemo(() => {
        if (filterStatus === 'All') {
            return applications;
        }
        return applications.filter(app => app.status === filterStatus);
    }, [filterStatus, applications]);

    const chartCardClasses = `bg-white rounded-xl shadow-lg p-6 transition-all duration-300 border border-gray-200`;


    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <AcademicCapIcon className="w-10 h-10 text-indigo-600 mr-4"/> Student Application Tracker
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                        Monitor the current application pipeline and analyze student placement performance.
                    </p>
                </header>

                {/* --- A. Summary Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <SummaryCard 
                        title="Total Applications" 
                        value={totalApplications} 
                        icon={<BriefcaseIcon className="w-6 h-6" />} 
                        color="bg-indigo-600" 
                    />
                    <SummaryCard 
                        title="Students Hired" 
                        value={totalHired} 
                        icon={<CheckCircleIcon className="w-6 h-6" />} 
                        color="bg-teal-600" 
                    />
                    <SummaryCard 
                        title="Interview Rate" 
                        value={`${interviewRate}%`} 
                        icon={<UserGroupIcon className="w-6 h-6" />} 
                        color="bg-emerald-500" 
                    />
                </div>

                {/* --- B. Charts Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    
                    {/* Application Pipeline Bar Chart */}
                    <div className={chartCardClasses}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <FunnelIcon className="w-5 h-5 text-indigo-600 mr-2"/> Application Status Pipeline
                        </h2>
                        <div className="h-80">
                            <Bar 
                                data={statusChartData} 
                                options={{...chartOptions, plugins: {...chartOptions.plugins, legend: { display: false }}}} 
                            />
                        </div>
                    </div>

                    {/* Branch Performance Bar Chart */}
                    <div className={chartCardClasses}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 text-teal-600 mr-2"/> Placement Performance by Branch
                        </h2>
                        <div className="h-80">
                            <Bar 
                                data={branchPerformanceData} 
                                options={{
                                    ...chartOptions, 
                                    scales: {...chartOptions.scales, x: {...chartOptions.scales.x, stacked: false}, y: {...chartOptions.scales.y, stacked: false}}
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* --- C. Detailed Application Table --- */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-10 flex items-center">
                    <BriefcaseIcon className="w-6 h-6 text-indigo-600 mr-2"/> Detailed Applications List
                </h2>
                
                {/* Status Tabs for Filtering */}
                <div className="flex border-b border-gray-200 mb-6">
                    {(['All', 'Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'] as (StudentApplication['status'] | 'All')[]).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-3 text-sm font-medium border-b-2 transition duration-150 ${
                                filterStatus === status
                                    ? 'border-indigo-500 text-indigo-600 bg-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {status} ({status === 'All' ? totalApplications : statusCounts[status as StudentApplication['status']]})
                        </button>
                    ))}
                </div>

                {/* Table View */}
                <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job/Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTableData.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {app.studentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentBranch}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.cgpa.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <p className="font-semibold">{app.jobTitle}</p>
                                        <p className="text-xs text-gray-500">{app.company}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.jobType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {/* Show buttons only if status is NOT already Hired or Rejected */}
                                        {(app.status !== 'Hired' && app.status !== 'Rejected') && (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'Hired')}
                                                    title="Mark as Hired"
                                                    className="p-1.5 rounded-full text-white bg-teal-500 hover:bg-teal-600 transition duration-150 shadow-md"
                                                >
                                                    <CheckBadgeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                                    title="Mark as Rejected"
                                                    className="p-1.5 rounded-full text-white bg-red-500 hover:bg-red-600 transition duration-150 shadow-md"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                        {/* Show confirmation text if already Hired or Rejected */}
                                        {(app.status === 'Hired' || app.status === 'Rejected') && (
                                            <span className={`text-xs font-medium ${app.status === 'Hired' ? 'text-teal-600' : 'text-red-600'}`}>
                                                {app.status === 'Hired' ? 'Final Offer' : 'Application Closed'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default StudentApplicationTracker;
