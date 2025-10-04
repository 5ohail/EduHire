import { useState, useMemo } from 'react';
import { Briefcase, Calendar, Clock, CheckCircle, ListFilter, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Assuming recharts is available

/**
 * Applicant type definition for better type safety and to resolve 'any' errors.
 */
interface Applicant {
  id: number;
  name: string;
  email: string;
  field: string;
  status: 'Hired' | 'Interviewing' | 'Applied' | 'Rejected';
  date: string;
}

// --- MOCK DATA ---
const mockApplicants: Applicant[] = [
  { id: 101, name: 'Alice Johnson', email: 'alice.j@example.com', field: 'Software Engineering', status: 'Hired', date: '2024-10-01' },
  { id: 102, name: 'Bob Smith', email: 'bob.s@example.com', field: 'Data Science', status: 'Interviewing', date: '2024-09-28' },
  { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com', field: 'Product Management', status: 'Applied', date: '2024-10-02' },
  { id: 104, name: 'Dana Lee', email: 'dana.l@example.com', field: 'Software Engineering', status: 'Applied', date: '2024-10-03' },
  { id: 105, name: 'Evan Green', email: 'evan.g@example.com', field: 'Data Science', status: 'Rejected', date: '2024-09-25' },
  { id: 106, name: 'Fiona Hart', email: 'fiona.h@example.com', field: 'UX/UI Design', status: 'Interviewing', date: '2024-10-01' },
  { id: 107, name: 'George Kim', email: 'george.k@example.com', field: 'Product Management', status: 'Applied', date: '2024-09-29' },
];

const allFields = [...new Set(mockApplicants.map(app => app.field))];

/**
 * Processes raw applicant data into a format suitable for charting.
 * Groups by field and calculates total applied vs. selected/progressing.
 */
const processChartData = (applicants: Applicant[]) => {
  const dataMap = applicants.reduce((acc, applicant) => {
    const field = applicant.field;
    if (!acc[field]) {
      acc[field] = { field, totalApplied: 0, totalSelected: 0 };
    }
    acc[field].totalApplied += 1;
    // Define "Selected/Progressing" as Hired or Interviewing status
    if (applicant.status === 'Hired' || applicant.status === 'Interviewing') {
      acc[field].totalSelected += 1;
    }
    return acc;
  }, {} as Record<string, { field: string; totalApplied: number; totalSelected: number }>);

  // Convert map values to an array for Recharts
  return Object.values(dataMap);
};

// Defined colors for professional aesthetic
const PRIMARY_COLOR = '#4f46e5'; // Indigo-600 for Total Applied
const SECONDARY_COLOR = '#059669'; // Emerald-600 for Selected

/**
 * Component to render the Bar Chart visualization.
 * Updated for professional aesthetics.
 */
const ApplicantCharts = ({ data }: { data: any[] }) => ( // Using any[] for simplicity here since chart data is a derived structure
    <div className="w-full h-80 p-4 border border-gray-200 rounded-xl shadow-inner bg-gray-50 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applicant & Selection Metrics by Field</h2>
        <ResponsiveContainer width="100%" height="85%">
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /> {/* Lighter, horizontal-only grid */}
                <XAxis dataKey="field" stroke="#6b7280" angle={-15} textAnchor="end" height={55} style={{ fontSize: '12px' }} tickLine={false} /> {/* Removed tick line */}
                <YAxis stroke="#6b7280" allowDecimals={false} tickLine={false} axisLine={false} /> {/* Removed axis line and tick line */}
                <Tooltip
                    cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} // Light gray hover background
                    contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px', 
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Added box shadow
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                    formatter={(value, name) => {
                        const formattedName = name === 'totalApplied' ? 'Total Applied' : 'Selected/Interviewing';
                        return [`${value} Applicants`, formattedName];
                    }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="totalApplied" name="Total Applied" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalSelected" name="Selected/Interviewing" fill={SECONDARY_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);


// The main application component for the Recruiter's Applicant Tracker
const RecruiterApplicant = () => {
  const [applicants] = useState<Applicant[]>(mockApplicants);
  const [selectedField, setSelectedField] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Process data for charts
  const chartData = useMemo(() => processChartData(applicants), [applicants]);

  /**
   * Filter and search the applicants based on selected field and search term.
   * This is memoized for performance.
   */
  const filteredApplicants = useMemo(() => {
    return applicants.filter(applicant => {
      // 1. Field Filter
      const matchesField = selectedField === 'All' || applicant.field === selectedField;

      // 2. Search Term Filter (Name or Email)
      const lowerCaseSearch = searchTerm.toLowerCase();
      const matchesSearch = applicant.name.toLowerCase().includes(lowerCaseSearch) ||
                            applicant.email.toLowerCase().includes(lowerCaseSearch);

      return matchesField && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by newest first
  }, [applicants, selectedField, searchTerm]);

  /**
   * Renders a styled badge for the application status.
   */
  const StatusBadge = ({ status }: { status: Applicant['status'] }) => {
    let classes = 'inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition duration-150 ease-in-out shadow-sm';
    let Icon = Clock;
    let color;

    switch (status) {
      case 'Hired':
        color = 'bg-green-100 text-green-800 ring-1 ring-green-300';
        Icon = CheckCircle;
        break;
      case 'Interviewing':
        color = 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300';
        break;
      case 'Applied':
        color = 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300';
        break;
      case 'Rejected':
        color = 'bg-red-100 text-red-800 ring-1 ring-red-300';
        break;
      default:
        color = 'bg-gray-100 text-gray-800 ring-1 ring-gray-300';
        Icon = Clock;
    }

    return (
      <span className={`${classes} ${color}`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {status}
      </span>
    );
  };

  /**
   * Renders a single row in the applicant table.
   */
  const ApplicantRow = ({ applicant }: { applicant: Applicant }) => (
    <div className="grid grid-cols-12 gap-4 items-center py-4 px-4 sm:px-6 hover:bg-indigo-50 transition duration-150 ease-in-out border-b border-gray-100 cursor-pointer">
      {/* Name and Email (Visible on all sizes) */}
      <div className="col-span-12 md:col-span-4 flex flex-col sm:flex-row sm:items-center">
        <div className="font-semibold text-gray-900 truncate">
          {applicant.name}
        </div>
        <div className="text-sm text-gray-500 sm:ml-2 sm:before:content-['|'] sm:before:mr-2 truncate">
          {applicant.email}
        </div>
      </div>

      {/* Field (Visible on Tablet/Desktop) */}
      <div className="col-span-4 hidden md:flex items-center text-sm text-gray-600">
        <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
        <span className="truncate">{applicant.field}</span>
      </div>

      {/* Date (Visible on Tablet/Desktop) */}
      <div className="col-span-2 hidden md:flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
        {applicant.date}
      </div>

      {/* Status (Visible on all sizes - shifts right on mobile) */}
      <div className="col-span-12 md:col-span-2 flex justify-start md:justify-end">
        <StatusBadge status={applicant.status} />
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-4 sm:p-8">

        {/* Header and Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Applications
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            Showing {filteredApplicants.length} applicants in your pipeline.
          </p>
          <div className="h-1 w-16 bg-indigo-500 mt-3 rounded-full"></div>
        </header>

        {/* Applicant Charts (New Section) */}
        <ApplicantCharts data={chartData} />

        {/* Controls: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
            />
          </div>

          {/* Field Filter Select */}
          <div className="relative w-full sm:w-60">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ListFilter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm appearance-none bg-white"
            >
              <option value="All">All Fields ({applicants.length})</option>
              {allFields.map(field => (
                <option key={field} value={field}>
                  {field} ({applicants.filter(a => a.field === field).length})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Applicant List Table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            {/* Table Header (Desktop/Tablet) */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-6 text-xs font-semibold uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
                <div className="col-span-4">Applicant</div>
                <div className="col-span-4">Field of Application</div>
                <div className="col-span-2">Date Applied</div>
                <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Applicant Rows */}
            {filteredApplicants.length > 0 ? (
                filteredApplicants.map(applicant => (
                    <ApplicantRow key={applicant.id} applicant={applicant} />
                ))
            ) : (
                <div className="p-10 text-center text-gray-500">
                    No applicants found matching your criteria.
                </div>
            )}
        </div>

        {/* Footer Note */}
        <footer className="mt-8 text-center text-sm text-gray-500">
            <p>Data last updated: {new Date().toLocaleTimeString()}</p>
        </footer>

      </div>
    </div>
  );
};

export default RecruiterApplicant;