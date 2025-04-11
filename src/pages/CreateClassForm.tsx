import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClass } from "../Redux/Auth/classSlice";
import { RootState, AppDispatch } from "../Redux/store";
import { PlusCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const CreateClassForm: React.FC = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.classSlice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Class name is required");

    dispatch(createClass({ name }))
      .unwrap()
      .then(() => {
        setName(""); // reset form
        toast.success("Class created successfully!"); // Success toast
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create class!"); // Error toast
      });
  };

  return (
    <>
      {/* Toast container */}
      <div>
        <ToastContainer /> {/* Display toast notifications here */}
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-blue-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <PlusCircle className="text-blue-600" />
            Create a New Class
          </h2>

          <label htmlFor="className" className="block text-gray-700 font-medium mb-2">
            Class Name
          </label>
          <input
            type="text"
            id="className"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grade 1, KG, Senior A"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Class"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateClassForm;
