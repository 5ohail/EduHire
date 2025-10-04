import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for proper routing
import { WrenchScrewdriverIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    // Outer container matching the application's pale background
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        
        {/* Main Content Card - Matching the dashboard's design */}
        <div className="bg-white p-10 sm:p-16 rounded-xl shadow-lg border border-gray-100">
          
          {/* Visual Element (Icon/Code) */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-indigo-100 rounded-full mb-8">
            <WrenchScrewdriverIcon className="w-10 h-10 text-indigo-600" />
          </div>

          {/* Large Error Code */}
          <h1 className="text-8xl font-extrabold text-gray-900 tracking-tighter mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you were looking for doesn't seem to exist. It might have been moved, deleted, or you might have mistyped the address.
          </p>

          {/* Call to Action Button: Updated to use Link */}
          <Link
            to="/" // Use 'to' prop for the destination route
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go back to Dashboard
          </Link>

        </div>
        
        {/* Footer/Contextual Text */}
        <p className="mt-8 text-sm text-gray-500">
            If you believe this is an error, please contact support.
        </p>

      </div>
    </div>
  );
};

export default NotFoundPage;