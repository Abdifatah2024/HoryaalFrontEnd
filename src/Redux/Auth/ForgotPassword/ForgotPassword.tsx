import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import { resetPassword, clearState } from "../../../pages/Auth/ResetPassword/authSlice";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    dispatch(resetPassword({ token, newPassword }));
  };

  if (success) {
    toast.success("Password reset successful!");
    setTimeout(() => {
      dispatch(clearState());
      navigate("/auth/login"); // Redirect user back to login page
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600" htmlFor="token">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter the code you received"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your new password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
