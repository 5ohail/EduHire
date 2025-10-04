import { useNavigate } from "react-router-dom"

const Card = ({img, types,title, content,btnTitle,nav} : {img: string, types: string, title: string, content: string, btnTitle: string,nav: string}) => {
  const navigate = useNavigate();
  return (
    <div className="shadow-sm rounded-xl w-76 gap-2 overflow-hidden h-96">
      <img className="w-76 h-40 object-cover" src={img} alt={title}/>
      <div className="p-4">
        <p className="my-1 text-blue-500 text-md">{types}</p>
        <h2 className="font-bold my-3 text-lg text-gray-800">{title}</h2>
        <p className="my-3 text-gray-700 font-light text-sm">{content}</p>
        <button className="mt-5 bg-blue-600 text-white py-2 px-5 cursor-pointer hover:bg-blue-500 rounded-lg w-full font-semibold text-sm" onClick={() => navigate(nav)}>{btnTitle}</button>
      </div>
    </div>
  )
}

export default Card
