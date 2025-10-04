import { useContext } from "react"
import StudentApplications from "../components/StudentApplications"
import PlacementCellApplications from "../components/PlacementCellApplications"
import MentorApplications from "../components/MentorApplications"
import { MyContext } from "../context/context"
import RecruiterApplicant from "../components/RecruiterApplicant"
function Applications() {
  const context = useContext(MyContext)
  if(!context){
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  const {designation} = context;

  return (
    <div>
      {designation == "placement cell" && <PlacementCellApplications />}
      {designation == "student" && <StudentApplications />}
      {designation == "mentor" && <MentorApplications />}
      {designation == "recruiter" && <RecruiterApplicant />}
    </div>
  )
}

export default Applications
