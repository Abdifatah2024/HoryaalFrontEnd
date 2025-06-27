import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect,  useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

import {
  createStudent,
  updateStudent,
  getStudentById,
  clearStudent,
  fetchSiblingStudentByPhone,
  clearSibling,
} from "../../Redux/Auth/RegstdSlice";

import { AppDispatch, RootState } from "../../Redux/store";

const StudentForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const studentState = useSelector((state: RootState) => state.StdRegSlice);

  const [editing, setEditing] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
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
      previousSchoolType: "",
      motherName: "",
      gender: "",
      age: 0,
      fee: 0,
      district: "",
      transfer: false,
      rollNumber: "",
      parentEmail: "",
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      classId: yup.string().required("Class is required"),
      phone: yup
        .string()
        .matches(/^[0-9]+$/, "Phone must be digits only")
        .required("Phone is required"),
      gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
      previousSchoolType: yup
        .string()
        .oneOf(["PRIVATE", "PUBLIC", "NOT_SPECIFIC"])
        .required("School type is required"),
      age: yup.number().min(3, "Minimum age is 3").required("Age is required"),
      fee: yup.number().required("Fee is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const payload = {
        ...values,
        fullname: [values.firstname, values.middlename, values.lastname, values.fourtname]
          .filter(Boolean)
          .join(" "),
        classId: values.classId,
        age: Number(values.age),
        fee: Number(values.fee),
        previousSchoolType: values.previousSchoolType || "NOT_SPECIFIC",
      };

      try {
        if (editing) {
          const res = await dispatch(updateStudent({ studentId: values.id, studentData: payload }));
          if (updateStudent.fulfilled.match(res)) {
            toast.success("Student updated!");
            resetForm();
            setEditing(false);
            dispatch(clearStudent());
          }
        } else {
          const res = await dispatch(createStudent(payload));
          if (createStudent.fulfilled.match(res)) {
            toast.success("Student registered!");
            resetForm();
            dispatch(clearSibling());
            setPrefilled(false);
          }
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSearch = () => {
    if (searchId.trim()) {
      dispatch(getStudentById(searchId)).then((action) => {
        if (getStudentById.fulfilled.match(action)) {
          toast.success("Student found!");
        } else {
          toast.error("Student not found.");
        }
      });
    }
  };

  useEffect(() => {
    const s = studentState.student;
    if (s && !editing) {
      formik.setValues({
        id: s.id,
        firstname: s.firstname || "",
        middlename: s.middlename || "",
        lastname: s.lastname || "",
        fourtname: s.fourtname || "",
        classId: s.classId.toString(),
        phone: s.phone || "",
        phone2: s.phone2 || "",
        bus: s.bus || "",
        address: s.address || "",
        previousSchool: s.previousSchool || "",
        previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
        motherName: s.motherName || "",
        gender: s.gender || "",
        age: s.age ?? 0,
        fee: s.fee ?? 0,
        district: s.district || "",
        transfer: s.transfer ?? false,
        rollNumber: s.rollNumber || "",
        parentEmail: s.parentEmail || "",
      });
      setEditing(true);
    }
  }, [studentState.student, editing, formik]);

  useEffect(() => {
    const trimmedPhone = formik.values.phone.trim();
    if (trimmedPhone.length >= 9 && !editing && !prefilled) {
      dispatch(fetchSiblingStudentByPhone(trimmedPhone));
    }
  }, [formik.values.phone, editing, prefilled, dispatch]);

  useEffect(() => {
    const s = studentState.siblingStudent;
    if (s && !editing && !prefilled) {
      formik.setValues({
        ...formik.values,
        middlename: s.middlename || "",
        lastname: s.lastname || "",
        fourtname: s.fourtname || "",
        phone2: s.phone2 || "",
        bus: s.bus || "",
        address: s.address || "",
        previousSchool: s.previousSchool || "",
        previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
        motherName: s.motherName || "",
        gender: s.gender || "",
        age: s.age ?? 0,
        fee: s.fee ?? 0,
        district: s.district || "",
        transfer: s.transfer ?? false,
        rollNumber: s.rollNumber || "",
        parentEmail: s.parentEmail || "",
        firstname: "",
        classId: "",
      });
      toast.success("Sibling data auto-filled.");
      setPrefilled(true);
    }
  }, [studentState.siblingStudent, editing, prefilled, formik]);

  return (
    <div className="p-4">
      {!editing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by ID</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border px-3 py-2 rounded w-full text-sm"
              placeholder="Enter student ID"
            />
            <button
              onClick={handleSearch}
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              <FiSearch />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {Object.entries(formik.initialValues).map(([key]) => {
  const value = formik.values[key as keyof typeof formik.values];

  return (
    <div key={key} className="mb-2">
      <label className="block text-sm font-medium capitalize mb-1">{key}</label>

      {typeof value === "boolean" ? (
        <input
          type="checkbox"
          name={key}
          checked={value}
          onChange={(e) => formik.setFieldValue(key, e.target.checked)}
          onBlur={formik.handleBlur}
        />
      ) : (
        <input
          type={typeof value === "number" ? "number" : "text"}
          name={key}
          value={value ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-3 py-2 rounded text-sm"
        />
      )}

      {formik.touched[key as keyof typeof formik.touched] &&
        formik.errors[key as keyof typeof formik.errors] && (
          <p className="text-red-500 text-sm mt-0.5">
            {formik.errors[key as keyof typeof formik.errors]}
          </p>
        )}
    </div>
  );
})}


        <div className="md:col-span-2 flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm"
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
              onClick={() => {
                const confirm = window.confirm("Are you sure you want to cancel editing?");
                if (confirm) {
                  formik.resetForm();
                  setEditing(false);
                  dispatch(clearStudent());
                  setPrefilled(false);
                }
              }}
              className="text-red-600 underline text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;