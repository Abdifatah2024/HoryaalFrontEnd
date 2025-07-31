// import {
//   Card,
//   CardContent,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Button,
//   CircularProgress,
//   Grid,
//   Chip,
//   Alert,
//   Stack,
//   Paper,
//   Box,
//   Divider,
//   Avatar,
//   LinearProgress,
//   useTheme,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   Update as UpdateIcon,
//   School as SchoolIcon,
//   Subject as SubjectIcon,
//   Assignment as AssignmentIcon,
//   Score as ScoreIcon,
// } from "@mui/icons-material";

// import {
//   updateStudentScore,
//   clearStudentScoreState,
// } from "../../Redux/Exam/studentScoreUpdateSlice";
// import { fetchTeacherCorrectionStatus } from "../../Redux/Exam/teacherManagementSlice";
// import { AppDispatch, RootState } from "../../Redux/store";

// interface DecodedToken {
//   userId: number;
//   [key: string]: unknown;
// }

// // Mock data
// const mockSubjects = [
//   { id: 1, name: "Chemistry" },
//   { id: 2, name: "Biology" },
//   { id: 3, name: "Physics" },
//   { id: 4, name: "Mathematics" },
//   { id: 5, name: "English" },
//   { id: 6, name: "Arabic" },
//   { id: 7, name: "Islamic" },
//   { id: 8, name: "Geography" },
//   { id: 9, name: "History" },
//   { id: 10, name: "Somali" },
// ];

// const mockExams = [
//   { id: 1, name: "Monthly", maxMarks: 20 },
//   { id: 2, name: "Midterm", maxMarks: 30 },
//   { id: 3, name: "Final", maxMarks: 50 },
// ];

// const academicYearId = 1;

// const UpdateStudentScoreForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const theme = useTheme();

//   const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);
//   // FIX 1: Correctly destructure useState, `teacherId` is the state, `_setTeacherId` is the setter.
//   // We use `_setTeacherId` to avoid the ESLint warning if `setTeacherId` is not used in the dependency array
//   // because the state value `teacherId` itself is not used directly as a dependency for `fetchTeacherCorrectionStatus`.
//   const [teacherId, _setTeacherId] = useState<number | null>(null);

//   const { correctionLimit, correctionsUsed, remaining } = useSelector(
//     (state: RootState) => state.teacherManagement
//   );

//   const { loading, error, success, updatedScore } = useSelector(
//     (state: RootState) => state.studentScore
//   );

//   const [studentId, setStudentId] = useState<number | "">("");
//   const [subjectId, setSubjectId] = useState<number | "">("");
//   const [examId, setExamId] = useState<number | "">("");
//   const [marks, setMarks] = useState<number>(0);

//   useEffect(() => {
//     try {
//       // const decoded: any = jwtDecode(token);
//       const decoded = jwtDecode<DecodedToken>(token);

//       if (decoded?.userId) {
//         // FIX 2: Call the correct setter function `_setTeacherId`
//         _setTeacherId(decoded.userId);
//         dispatch(fetchTeacherCorrectionStatus(decoded.userId));
//       }
//     } catch (e) {
//       console.error("Invalid token", e); // Log the error for better debugging
//     }
//     // FIX 3: Add `_setTeacherId` to the dependency array to satisfy ESLint,
//     // although for `useState` setters, it's generally safe to omit as they are stable.
//     // Given ESLint's strictness, including it explicitly resolves the warning.
//   }, [dispatch, token, _setTeacherId]);

//   useEffect(() => {
//     return () => {
//       dispatch(clearStudentScoreState());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     if (success) toast.success(success);
//     if (error) toast.error(error);
//   }, [success, error]); // Add error to dependencies

//   const handleSubmit = () => {
//     // Check if marks can be 0, if not, adjust condition
//     if (!studentId || !subjectId || !examId || marks === 0) {
//       toast.error("All fields are required, and marks must be > 0");
//       return;
//     }

//     dispatch(
//       updateStudentScore({
//         studentId: Number(studentId),
//         subjectId: Number(subjectId),
//         examId: Number(examId),
//         academicYearId,
//         newMarks: marks,
//       })
//     );
//   };

//   // const correctionPercentage = (correctionsUsed / correctionLimit) * 100;
//   // Handle cases where correctionLimit might be 0 to prevent division by zero
//   const safeCorrectionPercentage = correctionLimit > 0 ? (correctionsUsed / correctionLimit) * 100 : 0;


//   return (
//     <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
//       <Stack direction="row" alignItems="center" spacing={2} mb={4}>
//         <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
//           <UpdateIcon fontSize="large" />
//         </Avatar>
//         <div>
//           <Typography variant="h4" fontWeight={700}>
//             Update Student Score
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Enter and update student examination scores
//           </Typography>
//         </div>
//       </Stack>

//       <Grid container spacing={3}>
//         {/* Left Column: Correction Status */}
//         <Grid item xs={12} md={4}>
//           <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//                 <SchoolIcon color="primary" />
//                 <Typography variant="h6" fontWeight={600}>
//                   Correction Status
//                 </Typography>
//               </Stack>

//               <Box mb={3}>
//                 <Stack direction="row" justifyContent="space-between" mb={1}>
//                   <Typography variant="body2" color="text.secondary">
//                     Corrections Used: {correctionsUsed}/{correctionLimit}
//                   </Typography>
//                   <Typography variant="body2" fontWeight={600}>
//                     {Math.round(safeCorrectionPercentage)}%
//                   </Typography>
//                 </Stack>
//                 <LinearProgress
//                   variant="determinate"
//                   value={safeCorrectionPercentage}
//                   color={
//                     safeCorrectionPercentage > 80
//                       ? "error"
//                       : safeCorrectionPercentage > 50
//                       ? "warning"
//                       : "primary"
//                   }
//                   sx={{ height: 8, borderRadius: 4 }}
//                 />
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid item xs={4}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       textAlign: "center",
//                       bgcolor: "primary.light",
//                       borderRadius: 2,
//                       borderLeft: `4px solid ${theme.palette.primary.main}`,
//                     }}
//                   >
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Limit
//                     </Typography>
//                     <Typography variant="h5" fontWeight={700}>
//                       {correctionLimit}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       textAlign: "center",
//                       bgcolor: "warning.light",
//                       borderRadius: 2,
//                       borderLeft: `4px solid ${theme.palette.warning.main}`,
//                     }}
//                   >
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Used
//                     </Typography>
//                     <Typography variant="h5" fontWeight={700}>
//                       {correctionsUsed}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       textAlign: "center",
//                       bgcolor: "success.light",
//                       borderRadius: 2,
//                       borderLeft: `4px solid ${theme.palette.success.main}`,
//                     }}
//                   >
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Remaining
//                     </Typography>
//                     <Typography variant="h5" fontWeight={700}>
//                       {remaining}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column: Form */}
//         <Grid item xs={12} md={8}>
//           <Card elevation={3} sx={{ borderRadius: 3 }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={1} mb={3}>
//                 <AssignmentIcon color="primary" />
//                 <Typography variant="h6" fontWeight={600}>
//                   Score Details
//                 </Typography>
//               </Stack>

//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     label="Student ID"
//                     type="number"
//                     value={studentId}
//                     onChange={(e) => setStudentId(Number(e.target.value))}
//                     InputProps={{
//                       startAdornment: <SchoolIcon color="action" sx={{ mr: 1 }} />,
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <FormControl fullWidth>
//                     <InputLabel>Subject</InputLabel>
//                     <Select
//                       value={subjectId}
//                       label="Subject"
//                       onChange={(e) => setSubjectId(Number(e.target.value))}
//                       startAdornment={<SubjectIcon color="action" sx={{ mr: 1 }} />}
//                     >
//                       {mockSubjects.map((s) => (
//                         <MenuItem key={s.id} value={s.id}>
//                           {s.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <FormControl fullWidth>
//                     <InputLabel>Exam</InputLabel>
//                     <Select
//                       value={examId}
//                       label="Exam"
//                       onChange={(e) => setExamId(Number(e.target.value))}
//                     >
//                       {mockExams.map((e) => (
//                         <MenuItem key={e.id} value={e.id}>
//                           {e.name} (Max: {e.maxMarks})
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     label="Marks"
//                     type="number"
//                     value={marks}
//                     onChange={(e) => setMarks(Number(e.target.value))}
//                     InputProps={{
//                       startAdornment: <ScoreIcon color="action" sx={{ mr: 1 }} />,
//                       inputProps: { min: 0 },
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{ mt: 3, py: 1.5 }}
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 startIcon={loading ? <CircularProgress size={20} /> : <UpdateIcon />}
//               >
//                 {loading ? "Updating..." : "Update Score"}
//               </Button>

//               {updatedScore && (
//                 <Box mt={3}>
//                   <Divider sx={{ mb: 2 }} />
//                   <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//                     <Avatar sx={{ bgcolor: "success.main", width: 32, height: 32 }}>
//                       <UpdateIcon fontSize="small" />
//                     </Avatar>
//                     <Typography variant="subtitle1" fontWeight={600}>
//                       Score Updated Successfully
//                     </Typography>
//                   </Stack>
//                   <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={1}>
//                     <Chip label={`Student ID: ${updatedScore.studentId}`} variant="outlined" color="primary" />
//                     <Chip label={`Subject ID: ${updatedScore.subjectId}`} variant="outlined" color="secondary" />
//                     <Chip label={`Exam ID: ${updatedScore.examId}`} variant="outlined" />
//                     <Chip label={`Marks: ${updatedScore.marks}`} color="success" />
//                     <Chip label={`Updated By: ${updatedScore.lastUpdatedBy}`} variant="outlined" />
//                     <Chip
//                       label={`At: ${new Date(updatedScore.lastUpdatedAt).toLocaleString()}`}
//                       variant="outlined"
//                     />
//                   </Stack>
//                 </Box>
//               )}

//               {error && (
//                 <Alert severity="error" sx={{ mt: 2 }}>
//                   {error}
//                 </Alert>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default UpdateStudentScoreForm;
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Chip,
  Alert,
  Stack,
  Paper,
  Box,
  Divider,
  Avatar,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Update as UpdateIcon,
  School as SchoolIcon,
  Subject as SubjectIcon,
  Assignment as AssignmentIcon,
  Score as ScoreIcon,
} from "@mui/icons-material";

import {
  updateStudentScore,
  clearStudentScoreState,
} from "../../Redux/Exam/studentScoreUpdateSlice";
import { fetchTeacherCorrectionStatus } from "../../Redux/Exam/teacherManagementSlice";
import { AppDispatch, RootState } from "../../Redux/store";

// ✅ Interface for decoding token safely
interface DecodedToken {
  userId: number;
  [key: string]: unknown;
}

// ✅ Mock data
const mockSubjects = [
  { id: 1, name: "Chemistry" },
  { id: 2, name: "Biology" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Mathematics" },
  { id: 5, name: "English" },
  { id: 6, name: "Arabic" },
  { id: 7, name: "Islamic" },
  { id: 8, name: "Geography" },
  { id: 9, name: "History" },
  { id: 10, name: "Somali" },
];

const mockExams = [
  { id: 1, name: "Monthly", maxMarks: 20 },
  { id: 2, name: "Midterm", maxMarks: 30 },
  { id: 3, name: "Final", maxMarks: 50 },
];

const academicYearId = 1;

const UpdateStudentScoreForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);

  // ✅ useState with intentionally unused value
useEffect(() => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded?.userId) {
      dispatch(fetchTeacherCorrectionStatus(decoded.userId));
    }
  } catch (e) {
    console.error("Invalid token", e);
  }
}, [dispatch, token]);


  const { correctionLimit, correctionsUsed, remaining } = useSelector(
    (state: RootState) => state.teacherManagement
  );

  const { loading, error, success, updatedScore } = useSelector(
    (state: RootState) => state.studentScore
  );

  const [studentId, setStudentId] = useState<number | "">("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [examId, setExamId] = useState<number | "">("");
  const [marks, setMarks] = useState<number>(0);

  useEffect(() => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded?.userId) {
        dispatch(fetchTeacherCorrectionStatus(decoded.userId));
      }
    } catch (e) {
      console.error("Invalid token", e);
    }
  }, [dispatch, token]);

  useEffect(() => {
    return () => {
      dispatch(clearStudentScoreState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  const handleSubmit = () => {
    if (!studentId || !subjectId || !examId || marks === 0) {
      toast.error("All fields are required, and marks must be > 0");
      return;
    }

    dispatch(
      updateStudentScore({
        studentId: Number(studentId),
        subjectId: Number(subjectId),
        examId: Number(examId),
        academicYearId,
        newMarks: marks,
      })
    );
  };

  const safeCorrectionPercentage =
    correctionLimit > 0 ? (correctionsUsed / correctionLimit) * 100 : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
          <UpdateIcon fontSize="large" />
        </Avatar>
        <div>
          <Typography variant="h4" fontWeight={700}>
            Update Student Score
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter and update student examination scores
          </Typography>
        </div>
      </Stack>

      <Grid container spacing={3}>
        {/* Left Column: Correction Status */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <SchoolIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Correction Status
                </Typography>
              </Stack>

              <Box mb={3}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Corrections Used: {correctionsUsed}/{correctionLimit}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round(safeCorrectionPercentage)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={safeCorrectionPercentage}
                  color={
                    safeCorrectionPercentage > 80
                      ? "error"
                      : safeCorrectionPercentage > 50
                      ? "warning"
                      : "primary"
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "primary.light",
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Limit
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {correctionLimit}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "warning.light",
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Used
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {correctionsUsed}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "success.light",
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.success.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {remaining}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Score Details
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Student ID"
                    type="number"
                    value={studentId}
                    onChange={(e) => setStudentId(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <SchoolIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subjectId}
                      label="Subject"
                      onChange={(e) => setSubjectId(Number(e.target.value))}
                      startAdornment={<SubjectIcon color="action" sx={{ mr: 1 }} />}
                    >
                      {mockSubjects.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Exam</InputLabel>
                    <Select
                      value={examId}
                      label="Exam"
                      onChange={(e) => setExamId(Number(e.target.value))}
                    >
                      {mockExams.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name} (Max: {e.maxMarks})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Marks"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <ScoreIcon color="action" sx={{ mr: 1 }} />,
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <UpdateIcon />}
              >
                {loading ? "Updating..." : "Update Score"}
              </Button>

              {updatedScore && (
                <Box mt={3}>
                  <Divider sx={{ mb: 2 }} />
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Avatar sx={{ bgcolor: "success.main", width: 32, height: 32 }}>
                      <UpdateIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Score Updated Successfully
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={1}>
                    <Chip label={`Student ID: ${updatedScore.studentId}`} variant="outlined" color="primary" />
                    <Chip label={`Subject ID: ${updatedScore.subjectId}`} variant="outlined" color="secondary" />
                    <Chip label={`Exam ID: ${updatedScore.examId}`} variant="outlined" />
                    <Chip label={`Marks: ${updatedScore.marks}`} color="success" />
                    <Chip label={`Updated By: ${updatedScore.lastUpdatedBy}`} variant="outlined" />
                    <Chip label={`At: ${new Date(updatedScore.lastUpdatedAt).toLocaleString()}`} variant="outlined" />
                  </Stack>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateStudentScoreForm;
