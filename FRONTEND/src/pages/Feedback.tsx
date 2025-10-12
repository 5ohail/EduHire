import { useContext } from "react"
import { MyContext } from "../context/context"
import RecruiterFeedback from "../components/RecruiterFeedback";
import MentorFeedback from "../components/MentorFeedback";
function Feedback() {
    const context = useContext(MyContext)
    if(!context){
      throw new Error("useMyContext must be used within a MyContextProvider");
    }
    const {designation} = context;
  return (
    <div>
      {designation == "recruiter" && <RecruiterFeedback />}
      {designation == "mentor" && <MentorFeedback />}
    </div>
  )
}

export default Feedback
