import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { store } from "../../Redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Student {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  fullname: string;
  classId: number;
  phone: string;
  gender: string;
  Age: number;
  fee: number;
  Amount: number;
  isdeleted: boolean;
  userid: number;
  classes: {
    id: number;
    name: string;
    userid: number;
  };
  user: {
    id: number;
    fullName: string;
    username: string;
  };
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [attendanceData, setAttendanceData] = useState<Record<number, { present: boolean; remark?: string }>>({});

  const headers = [
    { label: "ID", key: "id" },
    { label: "Fullname", key: "fullname" },
    { label: "Class", key: "classes.name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "Age" },
    { label: "Fee", key: "fee" },
    { label: "Amount", key: "Amount" },
    { label: "Phone", key: "phone" },
    { label: "Attendance", key: "attendance" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/student/studentList");
        setStudents(response.data);

        const classNames = response.data.map((student: Student) => student.classes.name);
        const uniqueClasses = Array.from(new Set(classNames)).sort();
        setClasses(uniqueClasses);

        const defaultAttendance: Record<number, { present: boolean }> = {};
        response.data.forEach((student: Student) => {
          defaultAttendance[student.id] = { present: true };
        });
        setAttendanceData(defaultAttendance);
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredStudents = students
    .filter(
      (student) =>
        student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedClass === "All" || student.classes.name === selectedClass)
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valueA = getNestedValue(a, sortKey);
      const valueB = getNestedValue(b, sortKey);

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });


  const saveAttendance = async () => {
    try {
      const stateData: any = store.getState() as {
        loginSlice: { data: { Access_token: string } };
      };
      const { Access_token = null } = stateData?.loginSlice?.data || {};
  
      if (!Access_token) {
        toast.error("Access token not found. Please login.");
        return;
      }
  
      const requests = Object.entries(attendanceData).map(([id, data]) =>
        axios.post(
          "http://localhost:4000/student/createattedence",
          {
            studentId: +id,
            present: data.present,
            remark: data.present ? "Present" : data.remark,
          },
          {
            headers: {
              Authorization: `Bearer ${Access_token}`,
            },
          }
        )
      );
  
      const responses = await Promise.all(requests);
  
      // Collect all messages from the backend
      const messages = responses.map((res) => res.data.message || "Attendance saved.");
      messages.forEach((msg) => toast.success(msg));
    } catch (error: any) {
      console.error(error);
  
      // Show message from backend if available
      const message =
        error.response?.data?.message || "Failed to save attendance. Please try again.";
      toast.error(message);
    }
  };
  

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">Student List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search students..."
              className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 shadow-md ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AiOutlineSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={`p-3 border rounded-lg ${
              darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
            }`}
          >
            <option value="All">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center text-gray-500">Loading students...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-gradient-to-b from-violet-900 to-indigo-900 text-white">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header.key}
                        className="p-3 text-left whitespace-nowrap cursor-pointer"
                        onClick={() => header.key !== "attendance" && handleSort(header.key)}
                      >
                        {header.label}{" "}
                        {sortKey === header.key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <motion.tr
                      key={student.id}
                      whileHover={{ scale: 1.01 }}
                      className={`border-b ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-all`}
                    >
                      <td className="p-3">{student.id}</td>
                      <td className="p-3">{student.fullname}</td>
                      <td className="p-3">{student.classes.name}</td>
                      <td className="p-3">{student.gender}</td>
                      <td className="p-3">{student.Age}</td>
                      <td className="p-3">${student.fee}</td>
                      <td className="p-3">${student.Amount}</td>
                      <td className="p-3">{student.phone}</td>
                      <td className="p-3">
                        <button
                          className={`px-3 py-1 rounded-full text-sm ${
                            attendanceData[student.id]?.present ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                          onClick={() =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [student.id]: {
                                ...prev[student.id],
                                present: !prev[student.id]?.present,
                              },
                            }))
                          }
                        >
                          {attendanceData[student.id]?.present ? "Present" : "Absent"}
                        </button>
                        {!attendanceData[student.id]?.present && (
                          <input
                            type="text"
                            placeholder="Remark"
                            className="mt-2 w-full p-1 text-sm border rounded text-black"
                            value={attendanceData[student.id]?.remark || ""}
                            onChange={(e) => {
                              const remark = e.target.value;
                              setAttendanceData((prev) => ({
                                ...prev,
                                [student.id]: {
                                  ...prev[student.id],
                                  remark,
                                },
                              }));
                            }}
                          />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={saveAttendance}
              >
                Save Attendance
              </button>
            </div>
          </>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students found</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default StudentList;
