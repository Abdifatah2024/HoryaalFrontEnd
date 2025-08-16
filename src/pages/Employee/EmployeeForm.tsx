import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  submitEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  resetEmployeeState,
} from '../../Redux/Epmloyee/employeeSlice';
import { Employee } from './types';
import {
  FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiBriefcase,
  FiCheckCircle, FiAlertCircle, FiLoader, FiHome, FiCreditCard, FiBook, FiTrash2
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// ✅ Custom error type
type EmployeeValidationErrors = {
  [K in keyof Employee]?: string;
};

// ✅ Initial form values
const initialForm: Employee = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  nationalId: '',
  phone: '',
  email: '',
  address: '',
  jobTitle: '',
  dateOfHire: '',
  education: '',
  bankAccount: '',
  salary: 0,
};

const EmployeeForm = () => {
  const dispatch = useAppDispatch();
  const { employee, loading, success, error } = useAppSelector((state) => state.employee);

  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState<Employee>(initialForm);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<EmployeeValidationErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setEditing(true);
    }
  }, [employee]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetEmployeeState());
        setFormData(initialForm);
        setEditing(false);
        setSearchId('');
        setShowDeleteConfirm(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleSearch = () => {
    if (searchId.trim()) {
      dispatch(getEmployeeById(searchId));
    }
  };

  const validate = (): boolean => {
    const newErrors: EmployeeValidationErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title required';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));
    if (errors[name as keyof Employee]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editing) {
      dispatch(updateEmployee(formData));
    } else {
      dispatch(submitEmployee(formData));
    }
  };

  const confirmDelete = () => {
    if (formData.id) {
      dispatch(deleteEmployee(formData.id.toString()));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl p-8 border"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          {editing ? 'Edit Employee' : 'Create New Employee'}
        </h2>

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
          >
            <FiSearch />
            Search
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<FiUser />} />
          <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} error={errors.email} icon={<FiMail />} />
          <Input name="phone" label="Phone" value={formData.phone} onChange={handleChange} icon={<FiPhone />} />
          <Input name="dateOfBirth" type="date" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} icon={<FiCalendar />} />
          <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
          <Input name="nationalId" label="National ID" value={formData.nationalId} onChange={handleChange} icon={<FiCreditCard />} />
          <Input name="address" label="Address" value={formData.address} onChange={handleChange} icon={<FiHome />} />
          <Input name="jobTitle" label="Job Title" value={formData.jobTitle} onChange={handleChange} error={errors.jobTitle} icon={<FiBriefcase />} />
          <Input name="dateOfHire" type="date" label="Date of Hire" value={formData.dateOfHire} onChange={handleChange} icon={<FiCalendar />} />
          <Input name="education" label="Education" value={formData.education} onChange={handleChange} icon={<FiBook />} />
          <Input name="bankAccount" label="Bank Account" value={formData.bankAccount} onChange={handleChange} icon={<FiCreditCard />} />
          <Input name="salary" type="number" label="Salary" value={formData.salary} onChange={handleChange} error={errors.salary} icon={<FiDollarSign />} min="0" step="1" />

          <div className="md:col-span-2 mt-4 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md flex justify-center items-center gap-2"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
              {editing ? 'Update Employee' : 'Create Employee'}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                <FiTrash2 />
                Delete Employee
              </button>
            )}

            {success && (
              <div className="text-green-700 bg-green-50 p-3 rounded flex items-center gap-2">
                <FiCheckCircle />
                Success! Employee {editing ? 'updated' : 'created'}.
              </div>
            )}
            {error && (
              <div className="text-red-700 bg-red-50 p-3 rounded flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </div>
            )}
          </div>
        </form>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete Employee?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Input component
const Input: React.FC<{
  name: string;
  label: string;
  value: string | number;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  min?: string | number;
  step?: string | number;
}> = ({ name, label, value, onChange, type = 'text', error, icon, min, step }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
        className={`w-full border rounded-lg py-2 pl-10 pr-3 focus:ring-indigo-500 focus:outline-none ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

// ✅ Select component
const Select: React.FC<{
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}> = ({ name, label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default EmployeeForm;
