import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";

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

  const headers = [
    { label: "ID", key: "id" },
    { label: "Fullname", key: "fullname" },
    { label: "Class", key: "classes.name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "Age" },
    { label: "Fee", key: "fee" },
    { label: "Amount", key: "Amount" },
    { label: "Phone", key: "phone" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/student/studentList");
        setStudents(response.data);
        
        // Extract unique class names
        const classNames = response.data.map((student: Student) => student.classes.name);
        const uniqueClasses = Array.from(new Set(classNames)).sort();
        setClasses(uniqueClasses);
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
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
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
    .filter(student => 
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

  return (
    <div className={`min-h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Student List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-4">
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
            className={`p-2 border rounded-lg ${
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
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="w-full">
              <thead className="bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      className="p-4 text-left cursor-pointer"
                      onClick={() => handleSort(header.key)}
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
                    whileHover={{ scale: 1.02 }}
                    className={`border-b ${
                      darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                    } transition-all`}
                  >
                    <td className="p-4">{student.id}</td>
                    <td className="p-4">{student.fullname}</td>
                    <td className="p-4">{student.classes.name}</td>
                    <td className="p-4">{student.gender}</td>
                    <td className="p-4">{student.Age}</td>
                    <td className="p-4">${student.fee}</td>
                    <td className="p-4">${student.Amount}</td>
                    <td className="p-4">{student.phone}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students found</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
