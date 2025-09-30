const IntershipDetails = () => {
  return (
    <>
    <h1 className="text-3xl mt-8 font-semibold text-center">Find Your Perfect Internship</h1>
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold py-4">Basic Information</h2>
        <div className="border-b border-b-gray-500 mb-4"></div>
        <form>
            <div className="flex justify-center gap-8 mb-2 items-center">
                <div className="flex flex-col mb-4 ">
                    <label htmlFor="name" className="text-gray-800 mb-2">FullName</label>
                    <input type="text" placeholder="Your Full Name" id="name" name="name" required className="w-96 h-11 border rounded-lg border-blue-400 bg-blue-100 text-sm px-2 outline-blue-500"/>
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="Education" className="text-gray-800 mb-2">Education</label>
                     <select name="Education" id="Education Details" className="w-96 border rounded-lg border-blue-400 h-11 bg-blue-100 text-sm px-2 outline-blue-500">
                    <option value="B.Tech">High School</option>
                    <option value="M.Tech">Undergraduate</option>
                    <option value="MBA">Postgraduate</option>
                </select>
                </div>
               
            </div>
            <div className="ml-4">
                <label htmlFor="details" className="text-gray-800">Course Year and Details</label>
                <input type="text" id="details" placeholder="e.g. B.Tech Computer Science and Engineering, 2nd Year" className="w-full border mt-2 outline-blue-500 h-11 px-3 rounded-lg border-blue-400 bg-blue-100 text-sm"/>
            </div>
        </form>
    </div>
    </>
  )
}

export default IntershipDetails
