import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStudentById } from '../../Redux/Auth/GetOneStudentsSlice';
import { AppDispatch, RootState } from '../../Redux/store';
import { LoaderIcon } from 'lucide-react';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state: RootState) => state.studentReducer);
  const [inputValue, setInputValue] = useState(id || '');
  const [localError, setLocalError] = useState<string | null>(null);

  // Sync input with URL parameter changes
  useEffect(() => {
    setInputValue(id || '');
  }, [id]);

  // Fetch student when URL id changes
  useEffect(() => {
    if (id) {
      const studentId = Number(id);
      if (isNaN(studentId)) {
        setLocalError('Invalid student ID');
        return;
      }
      setLocalError(null);
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = inputValue.trim();
    
    if (!studentId) {
      setLocalError('Please enter a student ID');
      return;
    }
    
    if (isNaN(Number(studentId))) {
      setLocalError('Student ID must be a number');
      return;
    }

    navigate(`/students/${studentId}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter student ID"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            aria-label="Student ID"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        {localError && (
          <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{localError}</p>
        )}
      </form>

      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Student Details
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-32" role="status">
            <LoaderIcon className="animate-spin h-6 w-6 text-blue-500" aria-hidden="true" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        ) : data ? (
          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="font-medium">Full Name:</span>
              <span>{data.fullname}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="font-medium">Class:</span>
              <span>{data.classes?.name || 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="font-medium">Added By:</span>
              <span>{data.user?.fullName || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No student data found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;