import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { FiLock } from "react-icons/fi";

const ResetPassword2 = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      token: "",
      newPassword: "",
    },
    validationSchema: yup.object({
      token: yup.string().required("Reset token is required"),
      newPassword: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Must include uppercase letter")
        .matches(/[a-z]/, "Must include lowercase letter")
        .matches(/[0-9]/, "Must include a number")
        .matches(/[^a-zA-Z0-9]/, "Must include a symbol")
        .required("New password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        await axios.post("/api/auth/password-reset/confirm", values);
        toast.success("Password reset successful!");
        navigate("/auth/login");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Toaster />
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Reset Your Password
        </h2>

        {/* Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reset Token
          </label>
          <input
            type="text"
            name="token"
            onChange={formik.handleChange}
            value={formik.values.token}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste your reset token here"
          />
          {formik.touched.token && formik.errors.token && (
            <p className="text-sm text-red-600">{formik.errors.token}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              name="newPassword"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="New password"
            />
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-sm text-red-600">{formik.errors.newPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword2;
