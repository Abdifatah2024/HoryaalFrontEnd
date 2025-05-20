
import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Stack, 
  InputAdornment,
  CircularProgress,
  Fade,
  Alert
} from "@mui/material";
import { 
  Person, 
  Email, 
  Phone, 
  Lock, 
  Badge,
  HowToReg
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { registerTeacher, clearTeacherState } from "../../Redux/Epmloyee/teacherRegisterSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const RegisterTeacher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.teacherRegister);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      phoneNumber: "",
    },
    validationSchema: yup.object({
      username: yup.string()
        .min(3, "Must be at least 3 characters")
        .max(20, "Must be 20 characters or less")
        .required("Username is required"),
      password: yup.string()
        .min(8, "Must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must contain uppercase, number & special char"
        )
        .required("Password is required"),
      email: yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      fullName: yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Full name is required"),
      phoneNumber: yup.string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: (values) => {
      dispatch(registerTeacher(values));
    },
  });

  useEffect(() => {
    if (success) {
      toast.success(success, { 
        position: 'top-center',
        style: {
          background: '#4caf50',
          color: '#fff',
        }
      });
      formik.resetForm();
      dispatch(clearTeacherState());
    }
    if (error) {
      toast.error(error, { 
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
        }
      });
    }
  }, [success, error, dispatch]);

  const formFields = [
    {
      name: "fullName",
      label: "Full Name",
      icon: <Person color="action" />,
      type: "text"
    },
    {
      name: "username",
      label: "Username",
      icon: <Badge color="action" />,
      type: "text"
    },
    {
      name: "email",
      label: "Email",
      icon: <Email color="action" />,
      type: "email"
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      icon: <Phone color="action" />,
      type: "tel"
    },
    {
      name: "password",
      label: "Password",
      icon: <Lock color="action" />,
      type: "password"
    },
  ];

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: 2
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              maxWidth: 500,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                mb: 2,
                color: 'primary.main'
              }}>
                <HowToReg fontSize="large" />
              </Box>
              
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Teacher Registration
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Fill in the details to register a new teacher account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%', mt: 2 }}>
                <Stack spacing={3}>
                  {formFields.map((field) => (
                    <TextField
                      key={field.name}
                      fullWidth
                      variant="outlined"
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      value={formik.values[field.name as keyof typeof formik.values]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(
                        formik.touched[field.name as keyof typeof formik.touched] &&
                        formik.errors[field.name as keyof typeof formik.errors]
                      )}
                      helperText={
                        formik.touched[field.name as keyof typeof formik.touched] &&
                        formik.errors[field.name as keyof typeof formik.errors]
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.icon}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        }
                      }}
                    />
                  ))}

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !formik.isValid}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <HowToReg />
                        )
                      }
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: 16,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      }}
                    >
                      {loading ? 'Registering...' : 'Register Teacher'}
                    </Button>
                  </motion.div>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </Fade>
  );
};

export default RegisterTeacher;