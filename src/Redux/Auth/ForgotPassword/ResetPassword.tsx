// import { useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../store";
// import { resetPassword, clearState } from "../../../pages/Auth/ResetPassword/authSlice";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";

// const ResetPassword = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { loading, error, success } = useAppSelector((state) => state.auth);

//   const [token, setToken] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token || !newPassword) {
//       toast.error("Please fill all fields");
//       return;
//     }
//     dispatch(resetPassword({ token, newPassword }));
//   };

//   if (success) {
//     toast.success("Password reset successful!");
//     setTimeout(() => {
//       dispatch(clearState());
//       navigate("/auth/login");
//     }, 1500);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
//       <Toaster position="top-right" />
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Reset Your Password</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block mb-1 text-sm text-gray-600" htmlFor="token">
//               Verification Code
//             </label>
//             <input
//               type="text"
//               id="token"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter the code you received"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm text-gray-600" htmlFor="newPassword">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter your new password"
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { resetPassword, clearState } from "../../../pages/Auth/ResetPassword/authSlice";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Button, Box, Typography, Paper } from "@mui/material";

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    dispatch(resetPassword({ token, newPassword }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (success) {
    toast.success("Password reset successful!");
    setTimeout(() => {
      dispatch(clearState());
      navigate("/auth/login");
    }, 1500);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe 0%, #e9d5ff 100%)",
        p: 2
      }}
    >
      <Toaster position="top-right" />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 2
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "primary.main",
            fontWeight: 600,
            mb: 4
          }}
        >
          Reset Your Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Verification Code"
            variant="outlined"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter the code you received"
            required
          />

          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            helperText="Password must be at least 8 characters"
          />

          {/* New Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem"
            }}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;