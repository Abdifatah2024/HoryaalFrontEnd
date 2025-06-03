import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  createStudent,
  updateStudent,
  getStudentById,
  clearStudent,
} from "../../Redux/Auth/RegstdSlice";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const StudentForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const studentState = useSelector((state: RootState) => state.StdRegSlice);

  const [editing, setEditing] = useState(false);
  const [searchId, setSearchId] = useState("");
  const toastId = "student-register";

  const classList = [
    { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
    { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1F" },
    { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
    { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
    { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
    { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
    { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
  ];

  const formik = useFormik({
    initialValues: {
      id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      fourtname: "",
      classId: "",
      phone: "",
      phone2: "",
      bus: "",
      address: "",
      previousSchool: "",
      previousSchoolType: "", // NEW
      motherName: "",
      gender: "",
      age: "",
      fee: "",
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      classId: yup.string().required("Class is required"),
      phone: yup.string().matches(/^[0-9]+$/, "Phone must be digits only").required("Phone is required"),
      gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
      previousSchoolType: yup.string().oneOf(["PRIVATE", "PUBLIC", "NOT_SPECIFIC"]).required("School type is required"),
      age: yup.number().min(3, "Minimum age is 3").required("Age is required"),
      fee: yup.number().required("Fee is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const payload = {
        ...values,
        age: Number(values.age),
        fee: Number(values.fee),
        classId: Number(values.classId),
        previousSchoolType: values.previousSchoolType || "NOT_SPECIFIC",
        fullname: `${values.firstname} ${values.middlename} ${values.lastname} ${values.fourtname}`.trim(),
      };

      try {
        if (editing) {
          const res = await dispatch(updateStudent({ studentId: values.id, studentData: payload }));
          if (updateStudent.fulfilled.match(res)) {
            toast.success("Student updated!", { id: toastId });
            resetForm();
            setEditing(false);
            dispatch(clearStudent());
          }
        } else {
          const res = await dispatch(createStudent(payload));
          if (createStudent.fulfilled.match(res)) {
            toast.success("Student registered!", { id: toastId });
            resetForm();
          }
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (studentState.student) {
      formik.setValues({
        id: studentState.student.id?.toString() || "",
        firstname: studentState.student.firstname || "",
        middlename: studentState.student.middlename || "",
        lastname: studentState.student.lastname || "",
        fourtname: studentState.student.fourtname || "",
        classId: studentState.student.classId?.toString() || "",
        phone: studentState.student.phone || "",
        phone2: studentState.student.phone2 || "",
        bus: studentState.student.bus || "",
        address: studentState.student.address || "",
        previousSchool: studentState.student.previousSchool || "",
        previousSchoolType: studentState.student.previousSchoolType || "NOT_SPECIFIC",
        motherName: studentState.student.motherName || "",
        gender: studentState.student.gender || "",
        age: studentState.student.Age?.toString() || "",
        fee: studentState.student.fee?.toString() || "",
      });
      setEditing(true);
    }
  }, [studentState.student]);

  useEffect(() => {
    if (studentState.error) {
      toast.error(studentState.error, { id: toastId });
    }
  }, [studentState.error]);

  const handleSearch = () => {
    if (searchId.trim()) {
      dispatch(getStudentById(searchId)).then((action) => {
        if (getStudentById.fulfilled.match(action)) {
          toast.success("Student found!", { id: toastId });
        } else {
          toast.error("Student not found", { id: toastId });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-xl">
        <div className="mb-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {editing ? "Edit Student Details" : "Register New Student"}
          </h2>

          {!editing && (
            <div className="bg-gray-50 border p-4 rounded-md shadow-sm mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FiSearch className="text-blue-500" />
                Search for a Student to Edit
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative w-full sm:w-72">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  type="button"
                  disabled={studentState.loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                >
                  Search Student
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Enter a valid student ID to auto-fill the form with their information.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["firstname", "middlename", "lastname", "fourtname", "phone", "phone2", "bus", "address", "previousSchool", "motherName", "age", "fee"].map((name) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                id={name}
                name={name}
                type={["age", "fee"].includes(name) ? "number" : "text"}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter ${name}`}
              />
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
              )}
            </div>
          ))}

          {/* Class Dropdown */}
          <div>
            <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              id="classId"
              name="classId"
              value={formik.values.classId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {formik.touched.classId && formik.errors.classId && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.classId}</p>
            )}
          </div>

          {/* Gender Dropdown */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
            )}
          </div>

          {/* Previous School Type Dropdown */}
          <div>
            <label htmlFor="previousSchoolType" className="block text-sm font-medium text-gray-700 mb-1">
              Previous School Type
            </label>
            <select
              id="previousSchoolType"
              name="previousSchoolType"
              value={formik.values.previousSchoolType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Type</option>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
              <option value="NOT_SPECIFIC">Not Specific</option>
            </select>
            {formik.touched.previousSchoolType && formik.errors.previousSchoolType && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.previousSchoolType}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              disabled={formik.isSubmitting || studentState.loading}
            >
              {formik.isSubmitting || studentState.loading
                ? "Processing..."
                : editing
                ? "Update Student"
                : "Register Student"}
            </button>

            {editing && (
              <button
                type="button"
                className="text-sm text-red-500 underline"
                onClick={() => {
                  setEditing(false);
                  dispatch(clearStudent());
                  formik.resetForm();
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
