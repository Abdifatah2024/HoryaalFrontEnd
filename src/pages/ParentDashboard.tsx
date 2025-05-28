import React from "react";
import { FiUser, FiBook, FiCalendar, FiActivity } from "react-icons/fi";

const ParentDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Parent Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome! Here's an overview of your child’s academic status.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Profile */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiUser className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Student Profile</h2>
          </div>
          <p className="text-sm text-gray-500">View your child’s personal info and photo.</p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiCalendar className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Attendance</h2>
          </div>
          <p className="text-sm text-gray-500">Track attendance and absentee days.</p>
        </div>

        {/* Exam Results */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiBook className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Exam Results</h2>
          </div>
          <p className="text-sm text-gray-500">See recent grades and academic progress.</p>
        </div>

        {/* Behavior / Discipline */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiActivity className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Disciplinary Records</h2>
          </div>
          <p className="text-sm text-gray-500">Review any incidents or commendations.</p>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
