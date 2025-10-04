import React, { useMemo } from 'react';

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; 
import { CheckCircleIcon, ChartBarIcon, CalendarDaysIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

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

// --- 2. Sample Data (Reused and slightly modified for Calendar dates) ---
const studentApplicationsData: StudentApplication[] = [
  { id: 1, studentName: 'Alice Johnson', studentBranch: 'CSE', jobTitle: 'Software Engineer Intern', company: 'Tech Innovators', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
  { id: 2, studentName: 'Bob Williams', studentBranch: 'ECE', jobTitle: 'Hardware Design Intern', company: 'ElectroTech', applicationDate: '2023-09-28', status: 'Applied', jobType: 'Internship' },
  { id: 3, studentName: 'Charlie Brown', studentBranch: 'CSE', jobTitle: 'Full Stack Developer', company: 'Web Solutions', applicationDate: '2023-10-05', status: 'Interview', jobType: 'Full-time' },
  { id: 4, studentName: 'Diana Prince', studentBranch: 'IT', jobTitle: 'Data Analyst', company: 'Data Insights', applicationDate: '2023-09-20', status: 'Rejected', jobType: 'Full-time' },
  { id: 5, studentName: 'Eve Adams', studentBranch: 'CSE', jobTitle: 'Software Engineer', company: 'Global Apps', applicationDate: '2023-10-05', status: 'Hired', jobType: 'Full-time' }, // Hired on 10-05
  { id: 6, studentName: 'Frank White', studentBranch: 'EEE', jobTitle: 'Power Systems Intern', company: 'Energy Co', applicationDate: '2023-10-10', status: 'Applied', jobType: 'Internship' },
  { id: 7, studentName: 'Grace Lee', studentBranch: 'ECE', jobTitle: 'Embedded Systems Engineer', company: 'Robotics Inc', applicationDate: '2023-10-01', status: 'Interview', jobType: 'Full-time' }, // Interview on 10-01
  { id: 8, studentName: 'Harry Wilson', studentBranch: 'IT', jobTitle: 'Cybersecurity Analyst', company: 'SecureNet', applicationDate: '2023-10-02', status: 'Interview', jobType: 'Full-time' },
  { id: 9, studentName: 'Ivy Davis', studentBranch: 'Mech', jobTitle: 'Mechanical Design Intern', company: 'Auto Industries', applicationDate: '2023-09-30', status: 'Applied', jobType: 'Internship' },
  { id: 10, studentName: 'Jack Miller', studentBranch: 'CSE', jobTitle: 'DevOps Engineer', company: 'Cloud Solutions', applicationDate: '2023-10-02', status: 'Hired', jobType: 'Full-time' }, // Hired on 10-02
  { id: 11, studentName: 'Karen Clark', studentBranch: 'IT', jobTitle: 'Web Developer', company: 'Digital Agency', applicationDate: '2023-10-05', status: 'Interview', jobType: 'Full-time' },
  { id: 12, studentName: 'Liam Green', studentBranch: 'Civil', jobTitle: 'Site Engineer Intern', company: 'Buildwell Constr', applicationDate: '2023-2023-10-12', status: 'Rejected', jobType: 'Internship' },
  { id: 13, studentName: 'Mia Hall', studentBranch: 'CSE', jobTitle: 'AI/ML Engineer', company: 'Cognitive AI', applicationDate: '2023-10-01', status: 'Hired', jobType: 'Full-time' }, // Hired on 10-01
  { id: 14, studentName: 'Noah King', studentBranch: 'ECE', jobTitle: 'RF Engineer', company: 'Telecom Solutions', applicationDate: '2023-10-07', status: 'Applied', jobType: 'Full-time' },
  { id: 15, studentName: 'Olivia Scott', studentBranch: 'CSE', jobTitle: 'Frontend Developer Intern', company: 'Innovatech Solutions', applicationDate: '2023-10-01', status: 'Under Review', jobType: 'Internship' },
  { id: 16, studentName: 'Peter B. Parker', studentBranch: 'IT', jobTitle: 'Software Engineer', company: 'Daily Bugle Tech', applicationDate: '2023-10-02', status: 'Hired', jobType: 'Full-time' }, // Hired on 10-02
];






// --- Chart Data Generators and Options (Light Theme 



// Generic Chart Options for Bar 


// --- Data Aggregation Logic for Calendar & Daily Chart ---

interface DailyActivity {
  interviews: number;
  hired: number;
  companies: Set<string>;
}

const generateCalendarData = (data: StudentApplication[]) => {
    // Map to store daily counts: Key is 'YYYY-MM-DD'
    const dailyActivities: Record<string, DailyActivity> = {};

    data.forEach(app => {
      // Use applicationDate as the key for daily activity
      const dateKey = app.applicationDate;

      if (!dailyActivities[dateKey]) {
        dailyActivities[dateKey] = { interviews: 0, hired: 0, companies: new Set() };
      }

      // Tally interviews and hired statuses
      if (app.status === 'Interview') {
        dailyActivities[dateKey].interviews += 1;
        dailyActivities[dateKey].companies.add(app.company);
      } else if (app.status === 'Hired') {
        dailyActivities[dateKey].hired += 1;
        dailyActivities[dateKey].companies.add(app.company);
      }
    });
    
    // 1. Prepare data for the Daily Activity Bar Chart (October 2023 for demonstration)
    const dailyLabels: string[] = [];
    const dailyInterviews: number[] = [];
    const dailyHired: number[] = [];

    // Generate labels for October 1st to 15th (since sample data falls here)
    for (let i = 1; i <= 15; i++) {
      const day = String(i).padStart(2, '0');
      const dateKey = `2023-10-${day}`;
      
      // Only show the day number in the chart label
      dailyLabels.push(day); 
      
      dailyInterviews.push(dailyActivities[dateKey]?.interviews || 0);
      dailyHired.push(dailyActivities[dateKey]?.hired || 0);
    }


    const dailyBarChartData = {
      labels: dailyLabels.map(l => `Oct ${l}`),
      datasets: [
        {
          label: 'Total Interviews',
          data: dailyInterviews,
          backgroundColor: '#34d399', // Emerald
          stack: 'stack1',
          borderRadius: 4,
        },
        {
          label: 'Offers Made (Hired)',
          data: dailyHired,
          backgroundColor: '#2dd4bf', // Teal
          stack: 'stack1',
          borderRadius: 4,
        },
      ],
    };

    // 2. Return daily activities map for the calendar grid
    return {
      dailyBarChartData,
      dailyActivitiesMap: dailyActivities,
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


// --- Main Component ---
const PlacementCalendarDashboard: React.FC = () => {

  const { dailyBarChartData, dailyActivitiesMap } = useMemo(() => generateCalendarData(studentApplicationsData), []);

  // Simplified Calendar: Fixed to October 2023 for demonstration
  const monthName = "October 2023";
  const daysInMonth = 31;
  const firstDayOfMonth = 0; // Oct 1, 2023 was a Sunday (0)

  // Helper array to generate calendar grid cells (42 cells: 6 rows x 7 days)
  const calendarDays = useMemo(() => {
    const days: { day: number, date: string, isCurrentMonth: boolean }[] = [];
    
    // Add padding for previous month (Sept 2023)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 30 - firstDayOfMonth + i + 1, date: `2023-09-${30 - firstDayOfMonth + i + 1}`, isCurrentMonth: false });
    }

    // Add days of the current month (October 2023)
    for (let i = 1; i <= daysInMonth; i++) {
      const dayString = String(i).padStart(2, '0');
      days.push({ day: i, date: `2023-10-${dayString}`, isCurrentMonth: true });
    }

    // Add padding for next month (November 2023) - Fill up to 6 rows (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const dayString = String(i).padStart(2, '0');
      days.push({ day: i, date: `2023-11-${dayString}`, isCurrentMonth: false });
    }

    return days.slice(0, 42); // Ensure exactly 6 rows
  }, [daysInMonth, firstDayOfMonth]);


  // Tailwind classes for the light chart card
  const lightChartCardClasses = `bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-200`;


  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight flex items-center">
          <CalendarDaysIcon className="w-10 h-10 text-indigo-600 mr-4"/> Placement Calendar Dashboard
        </h1>
        <p className="text-gray-500 mb-10">
          Visual overview of interviews conducted and hiring activity by date.
        </p>

        {/* --- Calendar View Section --- */}
        <div className={lightChartCardClasses}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 flex items-center">
            {monthName} Activity
          </h2>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-sm font-medium text-gray-700 text-center border-t border-l border-r border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 bg-gray-100 border-b border-r border-gray-200 font-bold">{day}</div>
            ))}
          </div>
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

        <hr className="my-10 border-gray-200" />
        
        {/* --- Daily Activity Bar Chart (Graph) --- */}
        <div className={lightChartCardClasses}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
            <ChartBarIcon className="w-6 h-6 text-indigo-600 mr-3"/> Daily Placements & Interviews (Oct 1-15)
          </h2>
          <div className="h-96">
            {/* Using the existing barChartOptions but allowing legend to show stacked data */}
            <Bar 
              data={dailyBarChartData} 
               
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementCalendarDashboard;