import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- INTERFACES ---

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  status: 'Recommended' | 'Applied' | 'Saved' | 'Interview' | 'Rejected';
  imageUrl: string;
  seatsFilled: number;
  seatsTotal: number;
}

interface FilterButtonProps {
  label: string;
  statusKey: Internship['status'] | 'All';
  currentFilter: Internship['status' ] | 'All';
  onClick: (filter: Internship['status'] | 'All') => void;
  count: number;
}

// --- UTILITY COMPONENTS ---

// Filter Button Component (Unchanged)
const FilterButton: React.FC<FilterButtonProps> = ({ label, statusKey, currentFilter, onClick, count }) => {
    const isActive = currentFilter === statusKey;
    return (
        <button
            onClick={() => onClick(statusKey)}
            className={`px-4 py-2 mr-3 mb-3 rounded-full text-sm font-semibold transition-colors duration-200 shadow-sm
                ${isActive
                    ? 'bg-blue-600 text-white shadow-blue-500/50'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }
            `}
        >
            {label} ({count})
        </button>
    );
};


// Internship Card Component (UPDATED for pixel-perfect alignment)
const InternshipCard: React.FC<{ internship: Internship }> = ({ internship }) => {
    const navigate = useNavigate(); 
    
    // Determine status badge style
    let statusClass = '';
    if (internship.status === 'Applied') statusClass = 'bg-blue-100 text-blue-700';
    else if (internship.status === 'Interview') statusClass = 'bg-green-100 text-green-700';
    else if (internship.status === 'Saved') statusClass = 'bg-yellow-100 text-yellow-700';
    else statusClass = 'bg-gray-100 text-gray-600';

    // CAPACITY CALCULATION
    const fillPercent = (internship.seatsFilled / internship.seatsTotal) * 100;
    const seatsRemaining = internship.seatsTotal - internship.seatsFilled;
    
    // Determine bar color based on fill status
    let barColor = 'bg-green-500';
    if (fillPercent >= 80) {
        barColor = 'bg-red-500'; // High urgency
    } else if (fillPercent >= 50) {
        barColor = 'bg-yellow-500'; // Medium urgency
    }

    return (
        // Fixed height and main flex container for consistent alignment
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 h-[350px] flex flex-col">
            
            {/* Image */}
            <div className="h-32 overflow-hidden flex-shrink-0"> 
                <img src={internship.imageUrl} alt={internship.title} className="w-full h-full object-cover" />
            </div>

            {/* Content area uses flex-grow and justify-between */}
            <div className="p-4 flex flex-col justify-between flex-grow">
                
                {/* Content wrapper with flex-grow to push the button down */}
                <div className="flex-grow">
                    
                    {/* ⭐ FIX: This block ensures title, company, location, and badge are a fixed height ⭐ */}
                    <div className="**h-[90px]**"> {/* Fixed height for consistent spacing */}
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{internship.title}</h3>
                            {/* Status badge moved to be directly adjacent to title if space allows */}
                        </div>
                        <p className="text-sm text-gray-600">{internship.company}</p>
                        <p className="text-xs text-gray-500 mb-2">{internship.location}</p> {/* mb-2 for consistent spacing */}
                    </div>
                    {/* ⭐ Status badge re-positioned here to align with the rest of the text content below the header ⭐ */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mb-3 ${statusClass}`}>
                        {internship.status}
                    </span>

                    {/* DYNAMIC PROGRESS BAR */}
                    <div className="mt-3 mb-3"> {/* Adjusted mt-3 to control space better */}
                        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                            <span>Seats Filled: {internship.seatsFilled}/{internship.seatsTotal}</span>
                            <span className={seatsRemaining <= 2 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                                {seatsRemaining} {seatsRemaining === 1 ? 'seat' : 'seats'} left
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                                style={{ width: `${fillPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                
                {/* Button is fixed at the bottom */}
                <button 
                    className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-150 text-sm mt-2"
                    onClick={() => navigate('/view')}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT (Unchanged) ---

const FilteredInternshipsList: React.FC = () => {
    const mockInternships: Internship[] = [
        { id: 1, title: 'Software Engineering Intern', company: 'Tech Solutions Inc.', location: 'Mumbai', status: 'Applied', imageUrl: 'https://placehold.co/400x200/555/fff?text=Tech+Team', seatsFilled: 8, seatsTotal: 10 },
        { id: 2, title: 'Data Science Intern', company: 'Data Insights Corp.', location: 'Bangalore', status: 'Interview', imageUrl: 'https://placehold.co/400x200/400/fff?text=Data+Analysis', seatsFilled: 19, seatsTotal: 20 },
        { id: 3, title: 'Product Management Intern', company: 'Product Innovators Ltd.', location: 'Pune', status: 'Saved', imageUrl: 'https://placehold.co/400x200/999/fff?text=Strategy', seatsFilled: 2, seatsTotal: 5 },
        { id: 4, title: 'UX/UI Design Intern', company: 'Creative Solutions', location: 'Remote', status: 'Applied', imageUrl: 'https://placehold.co/400x200/222/fff?text=Design+Studio', seatsFilled: 7, seatsTotal: 15 },
        { id: 5, title: 'Cloud DevOps Intern', company: 'CloudWorks', location: 'Hyderabad', status: 'Recommended', imageUrl: 'https://placehold.co/400x200/777/fff?text=Cloud', seatsFilled: 40, seatsTotal: 50 },
        { id: 6, title: 'Marketing Analyst Intern', company: 'Market Growth', location: 'Delhi', status: 'Saved', imageUrl: 'https://placehold.co/400x200/333/fff?text=Marketing', seatsFilled: 6, seatsTotal: 8 },
        { id: 7, title: 'Network Engineer Intern', company: 'NetSecure', location: 'Mumbai', status: 'Rejected', imageUrl: 'https://placehold.co/400x200/666/fff?text=Networking', seatsFilled: 12, seatsTotal: 12 },
        { id: 8, title: 'Financial Analyst Intern', company: 'Global Finance Co.', location: 'Chennai', status: 'Applied', imageUrl: 'https://placehold.co/400x200/F06292/fff?text=Finance', seatsFilled: 4, seatsTotal: 10 },
    ];

    const [filter, setFilter] = useState<'All' | Internship['status']>('Applied');

    // Calculate filtered list based on the active filter
    const filteredList = useMemo(() => {
        if (filter === 'All') {
            return mockInternships.filter(i => i.status !== 'Recommended');
        }
        return mockInternships.filter(i => i.status === filter);
    }, [filter, mockInternships]);

    // Calculate counts for filter buttons
    const counts = useMemo(() => {
        const c: Record<string, number> = { All: 0 };
        mockInternships.forEach(i => {
            if (i.status !== 'Recommended') {
                c.All++;
                c[i.status] = (c[i.status] || 0) + 1;
            }
        });
        return c;
    }, [mockInternships]);
    

    const filterOptions = [
        { label: 'All Chosen', statusKey: 'All', count: counts.All || 0 },
        { label: 'Applied', statusKey: 'Applied', count: counts.Applied || 0 },
        { label: 'Saved', statusKey: 'Saved', count: counts.Saved || 0 },
        { label: 'Interview', statusKey: 'Interview', count: counts.Interview || 0 },
        { label: 'Rejected', statusKey: 'Rejected', count: counts.Rejected || 0 },
    ];

    return (
        <div className="p-8 max-w-full mx-auto bg-gray-50 min-h-screen">
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">My Internships</h2>
            <p className="text-gray-600 mb-6">Track the status of all your applied and saved job opportunities.</p>

            {/* --- FILTER BUTTONS --- */}
            <div className="flex flex-wrap border-b border-gray-200 pb-4 mb-6">
                {filterOptions.map(option => (
                    <FilterButton
                        key={option.statusKey}
                        label={option.label}
                        statusKey={option.statusKey as 'All' | Internship['status']}
                        currentFilter={filter}
                        onClick={setFilter}
                        count={option.count}
                    />
                ))}
            </div>

            {/* --- INTERNSHIP LIST (Grid Alignment) --- */}
            {filteredList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredList.map(internship => (
                        <InternshipCard key={internship.id} internship={internship} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <p className="text-xl font-semibold text-gray-700">No internships found in the "{filter}" status.</p>
                    <p className="text-gray-500 mt-2">Try applying for a new job or checking your other filters!</p>
                </div>
            )}
        </div>
    );
};

export default FilteredInternshipsList;