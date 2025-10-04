import Card from "./Card"
interface card{
    img:string;
    types: string;
    title: string;
    content: string;
    btnTitle: string;
    nav : string;
}
const cardInformation:card[] = [
    {
    img:"/mentor[1].png",
    types:"Applications",
    title:"Approve Student Application",
    content: "Review and approve student applications for internships and placements.",
    btnTitle: "Review Applications"
    ,nav:"/applications"
    },
    {
    img:"/mentor[2].png",
    types:"Feedback",
    title:"Log Internship Feedback",
    content: "Provide feedback on student performance during internships.",
    btnTitle: "Submit Feedback"
    ,nav:"/feedback"
    },
    {
    img:"/mentor[3].png",
    types:"Students",
    title:"Access Student Profiles",
    content: "Quickly access student profiles and academic information",
    btnTitle: "View Students"
    ,nav:"/student-directory"
}
]
function MentorDashboard() {
  return (
    <>
    <div className="mt-8 mx-22 bg-gray">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Professor!</h1>
        <p className="text-gray-500 mt-2">Manage student applications, feedback, and profiles efficiently.</p>
    </div>
    <div className="flex flex-wrap justify-center">
        {cardInformation.map((card, index) => (
        <div key={index} className="mt-8 mx-12">
            <Card img={card.img} types={card.types} title={card.title} content={card.content} btnTitle={card.btnTitle} nav={card.nav}/>
        </div>
    ))}
    </div>
    
    </>
  )
}

export default MentorDashboard
