import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineSearch, AiOutlinePieChart, AiOutlineBarChart } from "react-icons/ai";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BASE_API_URL } from "../../Constant";

interface Student {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  fullname: string;
  classId: number;
  phone: string;
  gender: string;
  age: number;
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

const classList = [
  { id: 1, name: "1A" },
  { id: 38, name: "KG-2A" },
  { id: 39, name: "KG-1A" },
  
  { id: 2, name: "1B" }, { id: 3, name: "1C" }, { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1F" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" }, { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" }, { id: 16, name: "3D" }, { id: 17, name: "3E" },
  { id: 18, name: "4A" }, { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
  { id: 22, name: "5A" }, { id: 23, name: "5B" }, { id: 24, name: "5C" }, { id: 25, name: "5D" },
  { id: 26, name: "6A" }, { id: 27, name: "6B" }, { id: 28, name: "6C" }, { id: 29, name: "6D" },
  { id: 30, name: "7A" }, { id: 31, name: "7B" }, { id: 32, name: "7C" }, { id: 33, name: "7D" },
  { id: 34, name: "8A" }, { id: 35, name: "8B" }, { id: 36, name: "8C" }, { id: 37, name: "8D" }
];


const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042", "#8884D8", "#82CA9D"];

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [showGenderStats, setShowGenderStats] = useState(false);
  const [showClassStats, setShowClassStats] = useState(false);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Fullname", key: "fullname" },
    { label: "Class", key: "classes.name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "age" },
    { label: "Phone", key: "phone" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/student/studentList`);
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

  // Calculate gender distribution
  const genderData = students.reduce((acc, student) => {
    const existing = acc.find(item => item.name === student.gender);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: student.gender, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate class level distribution (1st, 2nd, 3rd, 4th year)
  const classLevelData = students.reduce((acc, student) => {
    const classLevel = student.classes.name.charAt(0); // Extract the first character (1, 2, 3, 4)
    const existing = acc.find(item => item.name === `Year ${classLevel}`);
    
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: `Year ${classLevel}`, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort class levels numerically
  const sortedClassLevelData = classLevelData.sort((a, b) => 
    a.name.localeCompare(b.name, undefined, { numeric: true })
  );

  // Calculate detailed class distribution
  const detailedClassData = classList.map(cls => {
    const count = students.filter(student => student.classes.name === cls.name).length;
    return {
      name: cls.name,
      students: count,
      level: cls.name.charAt(0)
    };
  });

  const genderStats = {
    total: students.length,
    male: genderData.find(g => g.name === "Male")?.value || 0,
    female: genderData.find(g => g.name === "Female")?.value || 0,
    other: genderData.find(g => g.name !== "Male" && g.name !== "Female")?.value || 0,
  };

const classStats = {
  totalClasses: new Set(students.map(s => s.classes.name)).size,
  year1: classLevelData.filter(c => c.name === "Year 1").reduce((acc, c) => acc + c.value, 0),
  year2: classLevelData.filter(c => c.name === "Year 2").reduce((acc, c) => acc + c.value, 0),
  year3: classLevelData.filter(c => c.name === "Year 3").reduce((acc, c) => acc + c.value, 0),
  year4: classLevelData.filter(c => c.name === "Year 4").reduce((acc, c) => acc + c.value, 0),
  year5: classLevelData.filter(c => c.name === "Year 5").reduce((acc, c) => acc + c.value, 0),
  year6: classLevelData.filter(c => c.name === "Year 6").reduce((acc, c) => acc + c.value, 0),
  year7: classLevelData.filter(c => c.name === "Year 7").reduce((acc, c) => acc + c.value, 0),
  year8: classLevelData.filter(c => c.name === "Year 8").reduce((acc, c) => acc + c.value, 0),
};

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
    <div className={`min-h-screen p-4 sm:p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">Student Analytics Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGenderStats(!showGenderStats)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <AiOutlinePieChart />
              {showGenderStats ? "Hide Gender" : "Gender Stats"}
            </button>
            <button
              onClick={() => setShowClassStats(!showClassStats)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <AiOutlineBarChart />
              {showClassStats ? "Hide Class" : "Class Stats"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="space-y-6 mb-6">
          {/* Gender Analysis Section */}
          {showGenderStats && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AiOutlinePieChart />
                Gender Distribution
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${entry.name ?? entry.value}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <h3 className="font-medium">Total Students</h3>
                    <p className="text-2xl font-bold">{genderStats.total}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <h3 className="font-medium">Male</h3>
                    <p className="text-2xl font-bold text-blue-500">{genderStats.male}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <h3 className="font-medium">Female</h3>
                    <p className="text-2xl font-bold text-pink-500">{genderStats.female}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <h3 className="font-medium">Other</h3>
                    <p className="text-2xl font-bold text-green-500">{genderStats.other}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Class Analysis Section */}
          {showClassStats && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AiOutlineBarChart />
                Class Distribution
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <h3 className="font-medium mb-2">By Year Level</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={sortedClassLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-64">
                  <h3 className="font-medium mb-2">Detailed Class Distribution</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={detailedClassData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#82ca9d" name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h3 className="font-medium">Total Classes</h3>
                  <p className="text-2xl font-bold">{classStats.totalClasses}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h3 className="font-medium">Form One</h3>
                  <p className="text-2xl font-bold text-purple-500">{classStats.year1}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h3 className="font-medium">Form Two</h3>
                  <p className="text-2xl font-bold text-blue-500">{classStats.year2}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h3 className="font-medium">Form Three</h3>
                  <p className="text-2xl font-bold text-green-500">{classStats.year3}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h3 className="font-medium">Form Four</h3>
                  <p className="text-2xl font-bold text-orange-500">{classStats.year4}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Search and Filter Controls */}
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
            {classList.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center text-gray-500">Loading students...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gradient-to-b from-violet-900 to-indigo-900 text-white">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      className="p-3 text-left whitespace-nowrap cursor-pointer"
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
                    whileHover={{ scale: 1.01 }}
                    className={`border-b ${
                      darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    } transition-all`}
                  >
                    <td className="p-3">{student.id}</td>
                    <td className="p-3">{student.fullname}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        student.classes.name.startsWith('1') ? 'bg-purple-100 text-purple-800' :
                        student.classes.name.startsWith('2') ? 'bg-blue-100 text-blue-800' :
                        student.classes.name.startsWith('3') ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {student.classes.name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        student.gender === "Male" ? "bg-blue-100 text-blue-800" :
                        student.gender === "Female" ? "bg-pink-100 text-pink-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="p-3">{student.age}</td>
                    <td className="p-3">{student.phone}</td>
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
