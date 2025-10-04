import { useContext } from "react"
import StudentApplications from "../components/StudentApplications"
import PlacementCellApplications from "../components/PlacementCellApplications"
import MentorApplications from "../components/MentorApplications"
import { MyContext } from "../context/context"
function Applications() {
  const context = useContext(MyContext)
  if(context == null){
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  const {designation} = context;

  return (
    <div>
      {designation == "placement cell" && <PlacementCellApplications />}
      {designation == "student" && <StudentApplications />}
      {designation == "mentor" && <MentorApplications />}
    </div>
  )
}

export default Applications
