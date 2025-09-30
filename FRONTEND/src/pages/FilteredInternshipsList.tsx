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
}

interface FilterButtonProps {
  label: string;
  statusKey: Internship['status'] | 'All';
  currentFilter: Internship['status'] | 'All';
  onClick: (filter: Internship['status'] | 'All') => void;
  count: number;
}

// --- UTILITY COMPONENTS ---

// Filter Button Component
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


// Internship Card Component (UPDATED with fixed height)
const InternshipCard: React.FC<{ internship: Internship }> = ({ internship }) => {
    const navigate =useNavigate();
    // Determine status badge style
    let statusClass = '';
    if (internship.status === 'Applied') statusClass = 'bg-blue-100 text-blue-700';
    else if (internship.status === 'Interview') statusClass = 'bg-green-100 text-green-700';
    else if (internship.status === 'Saved') statusClass = 'bg-yellow-100 text-yellow-700';
    else statusClass = 'bg-gray-100 text-gray-600';

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 **h-[320px]** flex flex-col">
            
            {/* Image (Fixed height for uniformity) */}
            <div className="h-32 overflow-hidden flex-shrink-0"> 
                <img src={internship.imageUrl} alt={internship.title} className="w-full h-full object-cover" />
            </div>

            {/* Content (Uses flex-grow to take remaining space) */}
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{internship.title}</h3> {/* line-clamp to prevent overflow */}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${statusClass}`}>
                            {internship.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                    <p className="text-xs text-gray-500 mb-3">{internship.location}</p>
                </div>
                
                {/* Button (Sticks to the bottom) */}
                <button className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-150 text-sm mt-2"
                onClick={() => navigate('/view')}>
                    View Details
                </button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const FilteredInternshipsList: React.FC = () => {
    const mockInternships: Internship[] = [
        { id: 1, title: 'Software Engineering Intern', company: 'Tech Solutions Inc.', location: 'Mumbai', status: 'Applied', imageUrl: 'https://placehold.co/400x200/555/fff?text=Tech+Team' },
        { id: 2, title: 'Data Science Intern', company: 'Data Insights Corp.', location: 'Bangalore', status: 'Interview', imageUrl: 'https://placehold.co/400x200/400/fff?text=Data+Analysis' },
        { id: 3, title: 'Product Management Intern', company: 'Product Innovators Ltd.', location: 'Pune', status: 'Saved', imageUrl: 'https://placehold.co/400x200/999/fff?text=Strategy' },
        { id: 4, title: 'UX/UI Design Intern', company: 'Creative Solutions', location: 'Remote', status: 'Applied', imageUrl: 'https://placehold.co/400x200/222/fff?text=Design+Studio' },
        { id: 5, title: 'Cloud DevOps Intern', company: 'CloudWorks', location: 'Hyderabad', status: 'Recommended', imageUrl: 'https://placehold.co/400x200/777/fff?text=Cloud' },
        { id: 6, title: 'Marketing Analyst Intern', company: 'Market Growth', location: 'Delhi', status: 'Saved', imageUrl: 'https://placehold.co/400x200/333/fff?text=Marketing' },
        { id: 7, title: 'Network Engineer Intern', company: 'NetSecure', location: 'Mumbai', status: 'Rejected', imageUrl: 'https://placehold.co/400x200/666/fff?text=Networking' },
    ];

    const [filter, setFilter] = useState<'All' | Internship['status']>('Applied');

    // Calculate filtered list based on the active filter
    const filteredList = useMemo(() => {
        if (filter === 'All') {
            // "All" should include all internships the student has acted upon
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

            {/* --- INTERNSHIP LIST --- */}
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