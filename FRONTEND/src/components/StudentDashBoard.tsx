import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/context";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const StudentDashboard = () => {
  const context = useContext(MyContext);
  if (!context) console.error("No Authenticated user found");
  const { email } = context;

  const [fetchedApplications, setFetchedApplications] = useState<any[]>([]);

  const recommendedInternships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Tech Solutions Inc.",
      imageUrl:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1770&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Data Insights Corp.",
      imageUrl:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1770&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Product Management Intern",
      company: "Product Innovators Ltd.",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1675730350391-1e5a54a24a93?w=600&auto=format&fit=crop&q=60",
    },
  ];

  const applicationStatus = [
    {
      id: 1,
      internship: "Software Engineering Intern",
      company: "Tech Solutions Inc.",
      status: "Applied",
      statusColor: "text-green-600 bg-green-100",
      deadline: "2024-05-15",
    },
    {
      id: 2,
      internship: "Data Science Intern",
      company: "Data Insights Corp.",
      status: "Interview",
      statusColor: "text-orange-600 bg-orange-100",
      deadline: "2024-05-20",
    },
    {
      id: 3,
      internship: "Product Management Intern",
      company: "Product Innovators Ltd.",
      status: "Rejected",
      statusColor: "text-red-600 bg-red-100",
      deadline: "2024-05-10",
    },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      let data: any = {};
      try {
        const storedUser = localStorage.getItem("userData");
        data = storedUser ? JSON.parse(storedUser) : {};
      } catch (err) {
        console.error("Error parsing userData from localStorage:", err);
      }
      const token = data.token;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/applications/applied",
          { email }
        );
        const responseApplications = response.data.applications;

        if (responseApplications && Array.isArray(responseApplications)) {
          const mergedApplications = [
            ...responseApplications,
            ...applicationStatus.slice(-3),
          ];
          setFetchedApplications(responseApplications);
          console.log("Fetched Applications:", mergedApplications);
        } else {
          console.warn("Invalid response format from backend:", response.data);
        }
      } catch (error: any) {
        console.error(
          "Error fetching applications:",
          error.response?.data || error.message
        );
      }
    };

    fetchApplications();
  }, [email]);
  const handleDocumentClick = (docName: string) => {
  // Check if the document exists in localStorage (or backend)
  const storedDocs = JSON.parse(localStorage.getItem("uploadedDocs") || "{}");
  
  if (storedDocs[docName]) {
    // Open the document in a new tab
    window.open(storedDocs[docName], "_blank");
  } else {
    // Prompt file upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        // Save uploaded document as base64 (or send to backend)
        storedDocs[docName] = reader.result;
        localStorage.setItem("uploadedDocs", JSON.stringify(storedDocs));
        alert(`${docName} uploaded successfully!`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }
};


  const documents = [
    { name: "Resume.pdf", icon: "📄" },
    { name: "Cover_Letter.pdf", icon: "📝" },
    { name: "Skills_Badge_Sheet.pdf", icon: "📜" },
  ];

  const notifications = [
    {
      type: "warning",
      icon: "⏳",
      title: "Application Deadline Approaching",
      message:
        "Your application for the UX Design Intern role is due on 2024-05-18.",
    },
    {
      type: "success",
      icon: "✅",
      title: "Mentor Approval Received",
      message:
        "Prof. Smith has approved your application for Tech Solutions Inc.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="flex space-x-4 mb-10">
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/internships")}
        >
          <span className="mr-2">
            <div className="border-white border-2 p-1 rounded-full">
              <FaPlus size={10} />
            </div>
          </span>{" "}
          Apply to Internships
        </button>
        <button
          className="cursor-pointer flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/settings")}
        >
          <span className="mr-2">✏️</span> Update Profile
        </button>
      </div>

      {/* Recommended Internships */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recommended Internships
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {recommendedInternships.map((internship) => (
          <div
            key={internship.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${internship.imageUrl})` }}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">
                {internship.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{internship.company}</p>
              <button className="w-full py-2 border border-blue-500 text-blue-500 font-medium cursor-pointer rounded-lg hover:bg-blue-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Status */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Application Status
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Internship
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fetchedApplications.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400 italic"
                >
                  No Applications Found
                </td>
              </tr>
            ) : (
              fetchedApplications.map((app: any, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                    <span className="text-blue-500">
                      {/* icon placeholder */}💼
                    </span>
                    <span>{app.internship || app.jobTitle}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.statusColor ||
                        (app.status === "Rejected"
                          ? "text-red-600 bg-red-100"
                          : app.status === "Interview"
                          ? "text-orange-600 bg-orange-100"
                          : "text-green-600 bg-green-100")
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="underline decoration-dotted cursor-help"
                      title={app.deadline || app.applicationDate}
                    >
                      {app.deadline
                        ? new Date(app.deadline).toLocaleDateString()
                        : new Date(app.applicationDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    <div className="flex flex-col md:flex-row gap-6 mb-10">
  {/* Notifications */}
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
    <div className="flex flex-col gap-4">
      {notifications.length === 0 ? (
        <p className="text-gray-400 italic">No notifications</p>
      ) : (
        notifications.map((note, idx) => (
          <div
            key={idx}
            className={`flex items-start p-4 rounded-lg border-l-4 ${
              note.type === "success"
                ? "border-green-500 bg-green-50"
                : note.type === "warning"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <span className="text-2xl mr-3">{note.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{note.title}</p>
              <p className="text-gray-600 text-sm">{note.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Documents */}
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
    <div className="flex flex-wrap gap-4">
  {documents.map((doc, idx) => (
    <div
      key={idx}
      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleDocumentClick(doc.name)}
    >
      <div className="text-4xl mb-2">{doc.icon}</div>
      <p className="text-sm text-gray-700 text-center">{doc.name}</p>
    </div>
  ))}
</div>

  </div>
</div>

    </div>
  );
};

export default StudentDashboard;
