import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchEmployees } from '../../Redux/Epmloyee/employeeListSlice';
import {
  FiUser,

  FiSearch,
  FiEdit2,
  FiMoreVertical,
  FiPlus,
  FiAlertCircle,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AllEmployeesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employeeList);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female'>('all');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // ✅ FIXED FILTER LOGIC
  const filteredEmployees = employees.filter(emp =>
    (
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (activeTab === 'all' || emp.gender.toLowerCase() === activeTab)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const calculateTenure = (hireDate: string) => {
    const diff = Date.now() - new Date(hireDate).getTime();
    const years = new Date(diff).getUTCFullYear() - 1970;
    const months = new Date(diff).getUTCMonth();
    return `${years > 0 ? `${years}y ` : ''}${months}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Directory</h1>
          <p className="text-gray-500 mt-2">Manage your organization's employees</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Search by name or position..."
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <FiPlus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-6">
        {['all', 'male', 'female'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'all' | 'male' | 'female')}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All Employees' : tab}
          </button>
        ))}
      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center text-red-700">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* EMPLOYEE TABLE */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenure</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredEmployees.map(emp => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-gray-50 transition cursor-pointer ${
                    selectedEmployee?.id === emp.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full text-white flex items-center justify-center font-bold ${
                        emp.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{emp.fullName}</div>
                        <div className="text-xs text-gray-500">{emp.gender}, {calculateAge(emp.dateOfBirth)}y</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{emp.jobTitle}</div>
                    <div className="text-xs text-gray-500">{emp.education}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{emp.email}</div>
                    <div className="text-xs text-gray-500">{emp.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{calculateTenure(emp.dateOfHire)}</div>
                    <div className="text-xs text-gray-500">{formatDate(emp.dateOfHire)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">${emp.salary.toLocaleString()}</td>
                </motion.tr>
              ))}
              {!loading && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-10">
                    <FiUser className="mx-auto mb-2 text-3xl" />
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* EMPLOYEE DETAIL PANEL */}
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  selectedEmployee.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                }`}>
                  {selectedEmployee.fullName.split(' ').map((n: string) => n[0]).join('')}

                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                    <FiEdit2 size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <FiMoreVertical size={18} />
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.fullName}</h2>
              <p className="text-indigo-600 font-medium">{selectedEmployee.jobTitle}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* PERSONAL INFO */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <Info label="Gender" value={selectedEmployee.gender} />
                  <Info label="Date of Birth" value={`${formatDate(selectedEmployee.dateOfBirth)} (${calculateAge(selectedEmployee.dateOfBirth)}y)`} />
                  <Info label="National ID" value={selectedEmployee.nationalId} />
                </div>
              </div>

              {/* CONTACT INFO */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <Info label="Email" value={selectedEmployee.email} />
                  <Info label="Phone" value={selectedEmployee.phone} />
                  <Info label="Address" value={selectedEmployee.address} />
                </div>
              </div>

              {/* EMPLOYMENT INFO */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Employment Details</h3>
                <div className="space-y-2">
                  <Info label="Date of Hire" value={formatDate(selectedEmployee.dateOfHire)} />
                  <Info label="Tenure" value={calculateTenure(selectedEmployee.dateOfHire)} />
                  <Info label="Salary" value={`$${selectedEmployee.salary.toLocaleString()}`} />
                  <Info label="Bank Account" value={selectedEmployee.bankAccount} />
                </div>
              </div>

              {/* SYSTEM INFO */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">System Info</h3>
                <div className="space-y-2">
                  <Info label="Created By" value={selectedEmployee.createdBy?.username} />
                  <Info label="Created At" value={formatDate(selectedEmployee.createdAt)} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default AllEmployeesList;
