import React, { useMemo, useState, useEffect } from 'react';
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
import { 
    BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, ChartBarIcon, ChartPieIcon, CalendarDaysIcon, UserGroupIcon, BuildingOfficeIcon 
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

// --- 2. Mock Data (Used as a fallback if the API is unreachable) ---
const mockApplicationsData: StudentApplication[] = [
    { id: 1, studentName: 'Alice Johnson', studentBranch: 'CSE', jobTitle: 'Software Engineer Intern', company: 'Tech Innovators', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
    { id: 2, studentName: 'Bob Williams', studentBranch: 'ECE', jobTitle: 'Hardware Design Intern', company: 'ElectroTech', applicationDate: '2023-09-28', status: 'Applied', jobType: 'Internship' },
    { id: 3, studentName: 'Charlie Brown', studentBranch: 'CSE', jobTitle: 'Full Stack Developer', company: 'Web Solutions', applicationDate: '2023-10-05', status: 'Interview', jobType: 'Full-time' },
    { id: 4, studentName: 'Diana Prince', studentBranch: 'IT', jobTitle: 'Data Analyst', company: 'Data Insights', applicationDate: '2023-09-20', status: 'Rejected', jobType: 'Full-time' },
    { id: 5, studentName: 'Eve Adams', studentBranch: 'CSE', jobTitle: 'Software Engineer', company: 'Global Apps', applicationDate: '2023-10-05', status: 'Hired', jobType: 'Full-time' }, 
    { id: 6, studentName: 'Frank White', studentBranch: 'EEE', jobTitle: 'Power Systems Intern', company: 'Energy Co', applicationDate: '2023-10-10', status: 'Applied', jobType: 'Internship' },
    { id: 7, studentName: 'Grace Lee', studentBranch: 'ECE', jobTitle: 'Embedded Systems Engineer', company: 'Robotics Inc', applicationDate: '2023-10-01', status: 'Interview', jobType: 'Full-time' }, 
    { id: 8, studentName: 'Harry Wilson', studentBranch: 'IT', jobTitle: 'Cybersecurity Analyst', company: 'SecureNet', applicationDate: '2023-10-02', status: 'Interview', jobType: 'Full-time' },
    { id: 9, studentName: 'Ivy Davis', studentBranch: 'Mech', jobTitle: 'Mechanical Design Intern', company: 'Auto Industries', applicationDate: '2023-09-30', status: 'Applied', jobType: 'Internship' },
    { id: 10, studentName: 'Jack Miller', studentBranch: 'CSE', jobTitle: 'DevOps Engineer', company: 'Cloud Solutions', applicationDate: '2023-10-02', status: 'Hired', jobType: 'Full-time' }, 
    { id: 11, studentName: 'Karen Clark', studentBranch: 'IT', jobTitle: 'Web Developer', company: 'Digital Agency', applicationDate: '2023-10-05', status: 'Interview', jobType: 'Full-time' },
    { id: 12, studentName: 'Liam Green', studentBranch: 'Civil', jobTitle: 'Site Engineer Intern', company: 'Buildwell Constr', applicationDate: '2023-10-12', status: 'Rejected', jobType: 'Internship' },
    { id: 13, studentName: 'Mia Hall', studentBranch: 'CSE', jobTitle: 'AI/ML Engineer', company: 'Cognitive AI', applicationDate: '2023-10-01', status: 'Hired', jobType: 'Full-time' }, 
    { id: 14, studentName: 'Noah King', studentBranch: 'ECE', jobTitle: 'RF Engineer', company: 'Telecom Solutions', applicationDate: '2023-10-07', status: 'Applied', jobType: 'Full-time' },
    { id: 15, studentName: 'Olivia Scott', studentBranch: 'CSE', jobTitle: 'Frontend Developer Intern', company: 'Innovatech Solutions', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
    { id: 16, studentName: 'Peter B. Parker', studentBranch: 'IT', jobTitle: 'Software Engineer', company: 'Daily Bugle Tech', applicationDate: '2023-10-02', status: 'Hired', jobType: 'Full-time' }, 
];

// --- Summary Card Component ---
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

// --- Chart Colors and Options (Light Theme) ---
const chartColors = {
    status: { Applied: '#6b70f0', 'Under Review': '#facc15', Interview: '#34d399', Rejected: '#f87171', Hired: '#2dd4bf' },
    branch: { CSE: '#4f46e5', ECE: '#eab308', EEE: '#ef4444', IT: '#14b8a6', Mech: '#0d9488', Civil: '#c026d3' },
    jobType: { 'Full-time': '#8b5cf6', Internship: '#a855f7' }
};

const lightChartBackgroundColor = '#ffffff'; 
const lightGridColor = '#e5e7eb'; 
const lightTextColor = '#374151'; 

// Generic Bar Chart Options
const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
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

// Generic Doughnut Chart Options
const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right' as const,
            labels: { usePointStyle: true, color: lightTextColor },
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: lightTextColor,
            bodyColor: lightTextColor,
            borderColor: lightGridColor,
            borderWidth: 1,
            cornerRadius: 8,
        },
    },
    cutout: '65%',
    animation: { duration: 800 } as any, 
};

// --- Data Aggregation Logic (All-in-one) ---
interface DailyActivity {
    interviews: number;
    hired: number;
    companies: Set<string>;
}

const generateAllData = (data: StudentApplication[]) => {
    const statusCounts: Record<StudentApplication['status'], number> = { Applied: 0, 'Under Review': 0, Interview: 0, Rejected: 0, Hired: 0 };
    const branchCounts: Record<StudentApplication['studentBranch'], number> = { CSE: 0, ECE: 0, EEE: 0, IT: 0, Mech: 0, Civil: 0 };
    const jobTypeCounts: Record<StudentApplication['jobType'], number> = { 'Full-time': 0, Internship: 0 };
    const dailyActivities: Record<string, DailyActivity> = {};

    let totalHired = 0;
    let totalInterviews = 0;

    data.forEach(app => {
        statusCounts[app.status] += 1;
        branchCounts[app.studentBranch] += 1;
        jobTypeCounts[app.jobType] += 1;
        if (app.status === 'Hired') totalHired++;
        if (app.status === 'Interview') totalInterviews++;

        // Daily Activity for Calendar
        const dateKey = app.applicationDate;
        if (!dailyActivities[dateKey]) {
            dailyActivities[dateKey] = { interviews: 0, hired: 0, companies: new Set() };
        }
        if (app.status === 'Interview') {
            dailyActivities[dateKey].interviews += 1;
            dailyActivities[dateKey].companies.add(app.company);
        } else if (app.status === 'Hired') {
            dailyActivities[dateKey].hired += 1;
            dailyActivities[dateKey].companies.add(app.company);
        }
    });
    
    // --- 1. Status Chart Data ---
    const statusLabels: (keyof typeof statusCounts)[] = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'];
    const statusChartData = {
        labels: statusLabels,
        datasets: [{
            label: 'Applications',
            data: statusLabels.map(status => statusCounts[status]),
            backgroundColor: statusLabels.map(status => chartColors.status[status]),
            borderRadius: 6,
        }],
    };

    // --- 2. Branch Chart Data (Showing Hired by Branch) ---
    const branchLabels: (keyof typeof branchCounts)[] = ['CSE', 'ECE', 'EEE', 'IT', 'Mech', 'Civil'];
    const hiredByBranch: Record<StudentApplication['studentBranch'], number> = { CSE: 0, ECE: 0, EEE: 0, IT: 0, Mech: 0, Civil: 0 };
    data.filter(app => app.status === 'Hired').forEach(app => hiredByBranch[app.studentBranch] += 1);
    
    const branchChartData = {
        labels: branchLabels,
        datasets: [{
            label: 'Hired Students',
            data: branchLabels.map(branch => hiredByBranch[branch]),
            backgroundColor: branchLabels.map(branch => chartColors.branch[branch]),
            borderRadius: 6,
        }],
    };

    // --- 3. Job Type Doughnut Data ---
    const jobTypeLabels: (keyof typeof jobTypeCounts)[] = ['Full-time', 'Internship'];
    const jobTypeDoughnutData = {
        labels: jobTypeLabels,
        datasets: [{
            label: 'Job Types',
            data: jobTypeLabels.map(type => jobTypeCounts[type]),
            backgroundColor: jobTypeLabels.map(type => chartColors.jobType[type]), 
            borderColor: lightChartBackgroundColor, 
            borderWidth: 4,
            hoverOffset: 8,
        }],
    };

    return {
        statusChartData,
        branchChartData,
        jobTypeDoughnutData,
        dailyActivitiesMap: dailyActivities,
        totalApplications: data.length,
        totalInterviews: totalInterviews,
        totalHired: totalHired,
        underReviewCount: statusCounts['Under Review'],
    };
};

// --- Calendar Cell Component ---
interface CalendarCellProps {
    day: number;
    date: string; // YYYY-MM-DD
    activity: DailyActivity | undefined;
    isCurrentMonth: boolean;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ day, activity, isCurrentMonth }) => {
    const interviews = activity?.interviews || 0;
    const hired = activity?.hired || 0;
    const companies = activity?.companies.size || 0;

    const cellClasses = isCurrentMonth 
        ? 'bg-white text-gray-900 border-gray-200' 
        : 'bg-gray-50 text-gray-400 border-gray-100';

    return (
        <div className={`h-28 p-2 border ${cellClasses} transition-all duration-200 hover:shadow-lg rounded-sm ${hired > 0 ? 'ring-2 ring-teal-300' : ''}`}>
            <div className={`text-lg font-semibold mb-1 ${hired > 0 ? 'text-teal-600' : ''}`}>
                {day}
            </div>
            {interviews > 0 && (
                <p className="text-xs font-medium text-emerald-600 flex items-center mt-1">
                    <UserGroupIcon className="w-4 h-4 mr-1"/> {interviews} Interviews
                </p>
            )}
            {hired > 0 && (
                <p className="text-xs font-medium text-teal-700 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1"/> {hired} Hired!
                </p>
            )}
            {companies > 0 && (
                <p className="text-xs text-gray-500 flex items-center mt-1">
                    <BuildingOfficeIcon className="w-3 h-3 mr-1"/> {companies} {companies > 1 ? 'Companies' : 'Company'}
                </p>
            )}
        </div>
    );
};


// --- Main Component: App (Placement Analytics Dashboard) ---
const App: React.FC = () => {
    // --- State for Backend Data Integration ---
    const [applicationsData, setApplicationsData] = useState<StudentApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    // Conceptual Backend URL (Connects to your MERN Express server)
    const API_URL = 'http://localhost:5000/api/applications/analytics'; 
    const MAX_RETRIES = 5;

    /**
     * @function apiFetchWithRetry
     * @description Executes a fetch request with exponential backoff for retries.
     * @param {string} url - The API endpoint URL.
     * @param {RequestInit} options - Fetch options (method, headers, body).
     * @param {number} retries - Current retry count.
     * @returns {Promise<any>} The parsed JSON data.
     */
    const apiFetchWithRetry = async (url: string, options: RequestInit, retries: number = 0): Promise<any> => {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Retry for server errors (5xx) or temporary network issues
                if ((response.status >= 500 || response.status === 408) && retries < MAX_RETRIES) {
                    const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s, ...
                    await new Promise(resolve => setTimeout(resolve, delay));
                    console.warn(`Fetch failed (Status ${response.status}). Retrying in ${delay / 1000}s...`);
                    return apiFetchWithRetry(url, options, retries + 1);
                }
                // If permanent error (4xx) or max retries reached, throw
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            // Retry for fundamental network errors (e.g., server not reachable)
            if (retries < MAX_RETRIES) {
                const delay = Math.pow(2, retries) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                console.warn(`Network error. Retrying in ${delay / 1000}s...`);
                return apiFetchWithRetry(url, options, retries + 1);
            }
            throw error; // Throw after final attempt fails
        }
    };


    // --- Data Fetching Logic (Integration Point) ---
    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            setIsError(false);
            
            // Attempt to retrieve JWT token for protected route access
            const token = localStorage.getItem('jwtToken'); 

            try {
                // Attempt to fetch data using the robust retry function
                const data = await apiFetchWithRetry(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include Authorization header only if token exists
                        ...(token && { 'Authorization': `Bearer ${token}` }), 
                    },
                });
                
                // Assuming the backend returns an object with an 'applications' array
                setApplicationsData(data.applications || []);
                
            } catch (error) {
                console.error('Failed to fetch data after all retries:', error);
                setIsError(true);
                
                // CRITICAL: Fallback to mock data to keep the UI functional 
                // when the local MERN server is not running in the preview environment
                setApplicationsData(mockApplicationsData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []); // Runs once on component mount

    // --- Data Aggregation (Memoized for performance) ---
    const { 
        statusChartData, 
        branchChartData, 
        jobTypeDoughnutData, 
        dailyActivitiesMap, 
        totalApplications, 
        totalInterviews,
        totalHired, 
        underReviewCount 
    } = useMemo(() => generateAllData(applicationsData), [applicationsData]);


    // --- Calendar Setup: October 2023 (Hardcoded for sample data) ---
    const monthName = "October 2023";
    const daysInMonth = 31;
    const firstDayOfMonth = 0; // Oct 1, 2023 was a Sunday (0)

    const calendarDays = useMemo(() => {
        const days: { day: number, date: string, isCurrentMonth: boolean }[] = [];
        
        // Previous month days to pad the start
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: 30 - firstDayOfMonth + i + 1, date: `2023-09-${30 - firstDayOfMonth + i + 1}`, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = String(i).padStart(2, '0');
            days.push({ day: i, date: `2023-10-${dayString}`, isCurrentMonth: true });
        }

        // Next month days to pad the end
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const dayString = String(i).padStart(2, '0');
            days.push({ day: i, date: `2023-11-${dayString}`, isCurrentMonth: false });
        }

        return days.slice(0, 42); 
    }, [daysInMonth, firstDayOfMonth]);


    // Tailwind classes for the light chart card
    const chartCardClasses = `bg-white rounded-xl shadow-lg p-6 transition-all duration-300 border border-gray-200`;

    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-indigo-600 animate-pulse p-8 bg-white rounded-xl shadow-lg">
                    Loading Placement Data from API...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {isError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
                        <strong className="font-bold">API Error!</strong>
                        <span className="block sm:inline ml-2">Could not fetch data from backend at {API_URL} after retries. Displaying mock data. **Please ensure your MERN Express server is running.**</span>
                    </div>
                )}

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight flex items-center">
                    <ChartBarIcon className="w-10 h-10 text-indigo-600 mr-4"/> Placement Analytics Dashboard
                </h1>
                <p className="text-lg text-gray-500 mb-12">
                    Comprehensive overview of all student placement activities and performance metrics.
                </p>

                {/* --- 1. Summary Cards Section --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <SummaryCard 
                        title="Total Applications" 
                        value={totalApplications} 
                        icon={<BriefcaseIcon className="w-6 h-6" />} 
                        color="bg-indigo-600" 
                    />
                    <SummaryCard 
                        title="Total Interviews" 
                        value={totalInterviews} 
                        icon={<UserGroupIcon className="w-6 h-6" />} 
                        color="bg-emerald-500" 
                    />
                    <SummaryCard 
                        title="Successfully Placed" 
                        value={totalHired} 
                        icon={<CheckCircleIcon className="w-6 h-6" />} 
                        color="bg-teal-600" 
                    />
                    <SummaryCard 
                        title="Currently Under Review" 
                        value={underReviewCount} 
                        icon={<AcademicCapIcon className="w-6 h-6" />} 
                        color="bg-amber-500" 
                    />
                </div>

                {/* --- 2. Chart Section (Bar and Doughnut) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    
                    {/* Applications by Status Bar Chart */}
                    <div className={`${chartCardClasses} lg:col-span-2`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 text-indigo-600 mr-2"/> Application Pipeline Status
                        </h2>
                        <div className="h-80">
                            <Bar data={statusChartData} options={{...barChartOptions, plugins: {...barChartOptions.plugins, legend: { display: true, position: 'top' as const, labels: { color: lightTextColor }}}}} />
                        </div>
                    </div>

                    {/* Job Type Doughnut Chart */}
                    <div className={chartCardClasses}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <ChartPieIcon className="w-5 h-5 text-purple-600 mr-2"/> Full-time vs. Internship Ratio
                        </h2>
                        <div className="h-80 flex items-center justify-center">
                            <div className="w-full h-full max-w-xs">
                                <Doughnut data={jobTypeDoughnutData} options={doughnutChartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* --- 3. Calendar & Branch Chart Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    
                    {/* Hired by Branch Bar Chart (takes one column) */}
                    <div className={chartCardClasses}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 text-teal-600 mr-2"/> Hired Students by Branch
                        </h2>
                        <div className="h-96">
                            <Bar data={branchChartData} options={barChartOptions} />
                        </div>
                    </div>

                    {/* Activity Calendar (takes two columns) */}
                    <div className={`${chartCardClasses} lg:col-span-2`}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center">
                            <CalendarDaysIcon className="w-5 h-5 text-indigo-600 mr-2"/> {monthName} Activity Tracker
                        </h2>
                        
                        {/* Calendar Grid Header */}
                        <div className="grid grid-cols-7 text-sm font-medium text-gray-700 text-center border-t border-l border-r border-gray-200">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-2 bg-gray-100 border-b border-r border-gray-200 font-bold">{day}</div>
                            ))}
                        </div>
                        
                        {/* Calendar Grid Cells */}
                        <div className="grid grid-cols-7 border-b border-l border-r border-gray-200">
                            {calendarDays.map((day, index) => (
                                <CalendarCell 
                                    key={index} 
                                    day={day.day} 
                                    date={day.date}
                                    isCurrentMonth={day.isCurrentMonth}
                                    activity={dailyActivitiesMap[day.date]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;
