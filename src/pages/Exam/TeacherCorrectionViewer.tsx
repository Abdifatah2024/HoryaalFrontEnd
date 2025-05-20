// import {
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   Grid,
//   Typography,
//   Chip,
//   CircularProgress,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllTeachers,
//   fetchTeacherCorrectionStatus,
// } from "../../Redux/Exam/teacherCorrectionSlice";
// import { AppDispatch, RootState } from "../../Redux/store";

// const TeacherCorrectionStatusPanel = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     teachers,
//     correctionLimit,
//     correctionsUsed,
//     remaining,
//     loading,
//     error,
//   } = useSelector((state: RootState) => state.teacherCorrection);

//   const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");

//   useEffect(() => {
//     dispatch(fetchAllTeachers());
//   }, [dispatch]);

//   const handleTeacherChange = (event: SelectChangeEvent<number | string>) => {
//     const id = Number(event.target.value);
//     setSelectedTeacherId(id);
//     if (id) dispatch(fetchTeacherCorrectionStatus(id));
//   };

//   return (
//     <Card sx={{ mt: 4, p: 2 }}>
//       <CardContent>
//         <Typography variant="h6" gutterBottom fontWeight={600}>
//           Select Teacher to View Correction Status
//         </Typography>

//         <FormControl fullWidth sx={{ mt: 2 }}>
//           <InputLabel>Select Teacher</InputLabel>
//           <Select
//             label="Select Teacher"
//             value={selectedTeacherId}
//             onChange={handleTeacherChange}
//           >
//             {teachers.map((teacher) => (
//               <MenuItem key={teacher.id} value={teacher.id}>
//                 {teacher.fullName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {loading && <CircularProgress sx={{ mt: 3 }} />}

//         {!loading && selectedTeacherId && (
//           <Grid container spacing={2} sx={{ mt: 3 }}>
//             <Grid item xs={4}>
//               <Chip label={`Limit: ${correctionLimit}`} color="primary" />
//             </Grid>
//             <Grid item xs={4}>
//               <Chip label={`Used: ${correctionsUsed}`} color="warning" />
//             </Grid>
//             <Grid item xs={4}>
//               <Chip label={`Remaining: ${remaining}`} color="success" />
//             </Grid>
//           </Grid>
//         )}

//         {error && (
//           <Typography color="error" mt={2}>
//             {error}
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TeacherCorrectionStatusPanel;
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTeachers,
  fetchTeacherCorrectionStatus,
  setTeacherCorrectionLimit,
} from "../../Redux/Exam/teacherCorrectionSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import { toast } from "react-toastify";

const TeacherCorrectionStatusPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    teachers,
    correctionLimit,
    correctionsUsed,
    remaining,
    teacherName,
    loading,
    error,
    success,
  } = useSelector((state: RootState) => state.teacherCorrection);

  const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");
  const [newLimit, setNewLimit] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  const handleTeacherChange = (event: SelectChangeEvent<number | string>) => {
    const id = Number(event.target.value);
    setSelectedTeacherId(id);
    setNewLimit(0);
    if (id) dispatch(fetchTeacherCorrectionStatus(id));
  };

  const handleUpdateLimit = () => {
    if (!selectedTeacherId || !newLimit) {
      toast.error("Please select a teacher and enter a valid limit");
      return;
    }

    dispatch(
      setTeacherCorrectionLimit({
        userId: Number(selectedTeacherId),
        correctionLimit: newLimit,
      })
    ).then(() => {
      // Refresh status after update
      dispatch(fetchTeacherCorrectionStatus(Number(selectedTeacherId)));
    });
  };

  return (
    <Card sx={{ mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Admin: Set & View Teacher Correction Status
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Teacher</InputLabel>
          <Select
            label="Select Teacher"
            value={selectedTeacherId}
            onChange={handleTeacherChange}
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && <CircularProgress sx={{ mt: 3 }} />}

        {!loading && selectedTeacherId && (
          <>
            <Typography mt={3}>
              <strong>Teacher:</strong> {teacherName}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Chip label={`Limit: ${correctionLimit}`} color="primary" />
              </Grid>
              <Grid item xs={4}>
                <Chip label={`Used: ${correctionsUsed}`} color="warning" />
              </Grid>
              <Grid item xs={4}>
                <Chip label={`Remaining: ${remaining}`} color="success" />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} alignItems="center" mt={3}>
              <TextField
                label="New Correction Limit"
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
                size="small"
              />
              <Button variant="contained" onClick={handleUpdateLimit}>
                Update Limit
              </Button>
            </Stack>
          </>
        )}

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherCorrectionStatusPanel;
