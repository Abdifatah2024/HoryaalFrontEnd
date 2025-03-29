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
  const [sortKey, setSortKey] = useState<keyof Student | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch students from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/student/studentList"); // Replace with actual API URL
        setStudents(response.data);
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Sorting function
  const handleSort = (key: keyof Student) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter & Sort students dynamically
  const filteredStudents = students
    .filter((student) =>
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valueA = a[sortKey];
      const valueB = b[sortKey];

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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AiOutlineSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Loading and Error Handling */}
        {loading && <p className="text-center text-gray-500">Loading students...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {["fullname", "classId", "gender", "Age", "fee", "Amount", "phone"].map((key) => (
                    <th
                      key={key}
                      className="p-3 text-left cursor-pointer"
                      onClick={() => handleSort(key as keyof Student)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                      {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-b hover:bg-gray-200"
                  >
                    <td className="p-3">{student.fullname}</td>
                    <td className="p-3">{student.classes.name}</td>
                    <td className="p-3">{student.gender}</td>
                    <td className="p-3">{student.Age}</td>
                    <td className="p-3">${student.fee}</td>
                    <td className="p-3">${student.Amount}</td>
                    <td className="p-3">{student.phone}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* If no students found */}
        {!loading && !error && filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students found</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
