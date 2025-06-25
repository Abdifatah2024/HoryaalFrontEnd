import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  linkStudentToParent,
  resetEmployeeState,
} from "../../Redux/Epmloyee/employeeSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  styled
} from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  maxWidth: 500,
  margin: "0 auto"
}));

const UpdateParentForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success, studentParentData } = useAppSelector(
    (state) => state.employee
  );

  const [studentId, setStudentId] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleReset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!studentId || !parentPhone) return;

    dispatch(linkStudentToParent({ studentId: Number(studentId), parentPhone }));
  };

  const handleReset = () => {
    dispatch(resetEmployeeState());
    setStudentId("");
    setParentPhone("");
    setFormSubmitted(false);
  };

  const isInvalidStudentId = formSubmitted && !studentId;
  const isInvalidPhone = formSubmitted && !parentPhone;

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        Link Student to Parent
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student ID"
              type="number"
              variant="outlined"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              error={isInvalidStudentId}
              helperText={isInvalidStudentId ? "Student ID is required" : ""}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Parent Phone Number"
              type="tel"
              variant="outlined"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              error={isInvalidPhone}
              helperText={isInvalidPhone ? "Parent phone number is required" : ""}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 150 }}
            >
              {loading ? "Processing..." : "Link Parent"}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
          </Alert>
        )}
        
        {success && studentParentData && (
          <Alert severity="success">
            Successfully linked to parent: <strong>{studentParentData.parentUser.username}</strong>
          </Alert>
        )}
      </Box>
    </StyledPaper>
  );
};

export default UpdateParentForm;