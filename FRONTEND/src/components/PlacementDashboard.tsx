
interface Student {
  name: string;
  department: string;
  appliedFor: string;
  status: string;
}
interface Card {
  title: string;
  value: number;
}
const PlacementDashboard = ({students, cards}: {students: Student[], cards: Card[]}) => {
  return (
   <div className="p-6 bg-gray-50 min-h-screen ">
      {/* Stats Cards */}
      <div className="flex justify-between items-center mb-6 mt-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white w-[31%] p-8 hover:shadow-lg cursor-pointer transition-ease duration-300 rounded-lg shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-md text-gray-500 mb-2">{card.title}</h3>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="my-10 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Recent Activity</h1>
        <div>
            <button className="bg-gray-100 px-4 py-2 mx-2 text-sm rounded cursor-pointer font-semibold">View All Openings</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm cursor-pointer font-semibold">Post New Opening</button>
        </div>
      </div>
      
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-3 border-b-[1px] border-b-gray-300 text-gray-800 font-medium">Student Name</th>
              <th className="p-3 border-b-[1px] border-b-gray-300 text-gray-800 font-medium">Department</th>
              <th className="p-3 border-b-[1px] border-b-gray-300 text-gray-800 font-medium">Applied For</th>
              <th className="p-3 border-b-[1px] border-b-gray-300 text-gray-800 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="hover:bg-blue-50 cursor-pointer">
                <td className="p-3 border-b-[1px] border-b-gray-300 text-gray-900 text-md">{student.name}</td>
                <td className="p-3 border-b-[1px] border-b-gray-300 text-gray-600 text-sm">{student.department}</td>
                <td className="p-3 border-b-[1px] border-b-gray-300 text-gray-600 text-sm">{student.appliedFor}</td>
                <td className="p-3 border-b-[1px] border-b-gray-300">
                  <span
                    className={`px-4 py-1 text-sm rounded-full  ${
                      student.status === "Selected"
                        ? "bg-green-100 text-green-700"
                        : student.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PlacementDashboard
