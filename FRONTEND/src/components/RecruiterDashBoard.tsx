const RecruiterDashboard = () => {
  // Mock data for applicant shortlists
  const applicantShortlists = [
    {
      id: 1,
      title: 'Software Engineering Interns',
      applicants: 15,
      imageUrl: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29mdHdhcmUlMjBlbmdpbmVlcnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: 2,
      title: 'Product Management Interns',
      applicants: 12,
      imageUrl: 'https://plus.unsplash.com/premium_photo-1675730350391-1e5a54a24a93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdCUyMG1hbmFnZXJ8ZW58MHx8MHx8fDA%3D', // Example image
    },
    {
      id: 3,
      title: 'Data Science Interns',
      applicants: 8,
      imageUrl: 'https://images.unsplash.com/photo-1617240016072-d92174e44171?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fERhdGElMjBzY2llbmNlfGVufDB8fDB8fHww', // Example image
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Top Bar with Notification and User Avatar */}
        <h2 className="text-4xl font-bold text-gray-800 mb-2 ">Certificate Verification</h2>
        <p className="text-gray-600 mb-6">Verify the authenticity of student certificates.</p>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <h3 className="font-semibold text-gray-800 mb-2">Student ID</h3>
            <div className="flex items-center space-x-4">
          <label htmlFor="student-id" className="sr-only">Student ID</label>
          <input
            type="text"
            id="student-id"
            placeholder="Enter Student ID"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Verify
          </button>
        </div>
        </div>
        

      {/* Applicant Shortlists Section */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Applicant Shortlists</h2>
      <p className="text-gray-600 mb-6">Review shortlisted candidates for various roles.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {applicantShortlists.map((list) => (
          <div key={list.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden" 
              aria-label={`Image for ${list.title}`}
            >
              <img 
                src={list.imageUrl} 
                alt={`Decorative image for ${list.title}`} 
                className="w-full h-full object-cover object-center" 
              />
              {/* Optional: Add a subtle overlay if needed, as seen in the original screenshot */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{list.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{list.applicants} Applicants</p>
              <button className="w-full py-2 border border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;