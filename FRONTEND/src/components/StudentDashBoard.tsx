import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
const StudentDashboard = () => {
  // Mock data for the component
  const recommendedInternships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Tech Solutions Inc.',
      imageClass: 'bg-green-100', // Placeholder for distinct images/colors
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Data Insights Corp.',
      imageClass: 'bg-blue-100',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      title: 'Product Management Intern',
      company: 'Product Innovators Ltd.',
      imageClass: 'bg-purple-100',
      imageUrl: "https://plus.unsplash.com/premium_photo-1675730350391-1e5a54a24a93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdCUyMG1hbmFnZXJ8ZW58MHx8MHx8fDA%3D%3D"
    }
  ];

  const applicationStatus = [
    {
      id: 1,
      internship: 'Software Engineering Intern',
      company: 'Tech Solutions Inc.',
      status: 'Applied',
      statusColor: 'text-green-600 bg-green-100',
      deadline: '2024-05-15',
    },
    {
      id: 2,
      internship: 'Data Science Intern',
      company: 'Data Insights Corp.',
      status: 'Interview',
      statusColor: 'text-orange-600 bg-orange-100',
      deadline: '2024-05-20',
    },
    {
      id: 3,
      internship: 'Product Management Intern',
      company: 'Product Innovators Ltd.',
      status: 'Rejected',
      statusColor: 'text-red-600 bg-red-100',
      deadline: '2024-05-10',
    },
  ];

  const documents = [
    { name: 'Resume.pdf', icon: '📄' },
    { name: 'Cover_Letter.pdf', icon: '📝' },
    { name: 'Skills_Badge_Sheet.pdf', icon: '📜' },
  ];

  const notifications = [
    {
      type: 'warning',
      icon: '⏳',
      title: 'Application Deadline Approaching',
      message: 'Your application for the \'UX Design Intern\' role is due on 2024-05-18.',
    },
    {
      type: 'success',
      icon: '✅',
      title: 'Mentor Approval Received',
      message: 'Prof. Smith has approved your application for \'Tech Solutions Inc\'.',
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="flex space-x-4 mb-10">
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/internships')}>
          <span className="mr-2"><div className='border-white border-2 p-1 rounded-full'><FaPlus size={10} /></div></span> Apply to Internships
        </button>
        <button className="cursor-pointer flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-100 transition-colors"
        onClick={() => navigate('/settings')}>
          <span className="mr-2">✏️</span> Update Profile
        </button>
      </div>
      
      {/* Recommended Internships */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Internships</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {recommendedInternships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ backgroundImage: `url(${internship.imageUrl})` }}
              aria-label={`Image for ${internship.title}`}
            >
              {/* This inner div is for the 'Tech Stack Guide' text seen in the original image */}
              <div className="p-4 text-white text-xs backdrop-brightness-50 h-full flex items-center justify-center">
                {/* Could place subtle text here if desired, matching the original image's style */}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{internship.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{internship.company}</p>
              <button className="w-full py-2 border border-blue-500 text-blue-500 font-medium cursor-pointer rounded-lg hover:bg-blue-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Status */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status</h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicationStatus.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.internship}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.statusColor}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Documents and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <span className="text-xl text-blue-500 mr-4">{doc.icon}</span>
                  <p className="text-md text-gray-700">{doc.name}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-lg">
                  &mdash; {/* Minus or ellipsis icon placeholder */}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((note, index) => (
              <div key={index} className={`flex items-start p-4 bg-white rounded-xl shadow-lg border-l-4 ${note.type === 'warning' ? 'border-yellow-500' : 'border-green-500'}`}>
                <div className={`p-2 rounded-full mr-4 ${note.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {note.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{note.title}</h4>
                  <p className="text-sm text-gray-600">{note.message}</p>
                </div>
              </div>
            ))}
            {/* Adding the 'UX Design' notification from the image for completeness */}
             <div className="flex items-start p-4 bg-white rounded-xl shadow-lg border-l-4 border-yellow-500">
                <div className="p-2 rounded-full mr-4 bg-yellow-100 text-yellow-700">
                  ⏳
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Application Deadline Approaching</h4>
                  <p className="text-sm text-gray-600">Your application for the **'UX Design Intern'** role is due on **2024-05-18**.</p>
                </div>
              </div>
               {/* Adding the 'Mentor Approval' notification from the image for completeness */}
             <div className="flex items-start p-4 bg-white rounded-xl shadow-lg border-l-4 border-green-500">
                <div className="p-2 rounded-full mr-4 bg-green-100 text-green-700">
                  ✅
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Mentor Approval Received</h4>
                  <p className="text-sm text-gray-600">Prof. Smith has approved your application for **'Tech Solutions Inc'**.</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;