import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Card,
  CardContent,

  IconButton,
  Grid,
  Chip,
  Paper,
  Stack,
  Avatar,
  Divider,
   Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Close,
  Person,
  Class,
  Book,
  Add
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  assignTeacherToClassSubject,
  clearTeacherAssignmentState,
  deleteTeacherAssignment,
  fetchAllTeachers,
  fetchTeacherAssignments,
  updateTeacherAssignment,
} from "../../Redux/Exam/teacherAssignmentSlice";
import { AppDispatch, RootState } from "../../Redux/store";

// Mock data with more descriptive names
const mockClasses = [
  { id: 1, name: "1A" }, 
  { id: 2, name: "1B" }, 
  { id: 3, name: "1C" },
  { id: 4, name: "2A" }, 
  { id: 5, name: "2B" }, 
  { id: 7, name: "2C" },
  { id: 8, name: "2d" },
  { id: 9, name: "2E" },
  { id: 10, name: "2F" },
  { id: 11, name: "2E" },
  { id: 12, name: "2F" },
  { id: 13, name: "3A" },
  { id: 14, name: "3B" },
  { id: 15, name: "3C" },
  { id: 16, name: "3D" },
  { id: 17, name: "4A" },
  { id: 18, name: "4B" },
  { id: 19, name: "4C" },
  { id: 20, name: "4D" },
];

const mockSubjects = [
  { id: 1, name: "Chemistry"}, 
  { id: 2, name: "Biology", color: "success" },
  { id: 3, name: "Physics", color: "warning" }, 
  { id: 4, name: "Mathematics", color: "error" },
  { id: 5, name: "English", color: "info" },
  { id: 6, name: "Arabic", color: "info" },
  { id: 7, name: "Islamic", color: "info" },
  { id: 8, name: "eography", color: "info" },
  { id: 9, name: "History", color: "info" },
  { id: 10, name: "Somaali", color: "info" },
];

const TeacherAssignmentManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teachers, assignments, loading, error, success } = useSelector(
    (state: RootState) => state.teacherAssignment
  );

  const [teacherId, setTeacherId] = useState<number | "">("");
  const [classId, setClassId] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<number>(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<number | null>(null);

  const [editAssignmentId, setEditAssignmentId] = useState<number | null>(null);
  const [editClassId, setEditClassId] = useState<number | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(clearTeacherAssignmentState());
  }, [dispatch]);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherAssignments(Number(teacherId)));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (success) {
      toast.success(success, { position: "top-center" });
    }
    if (error) {
      toast.error(error, { position: "top-center" });
    }
  }, [success, error]);

  const handleAssign = () => {
    if (!teacherId) {
      toast.warning("Please select a teacher", { position: "top-center" });
      return;
    }

    const isDuplicate = assignments.some(
      (a) => a.classId === classId && a.subjectId === subjectId
    );
    
    if (isDuplicate) {
      toast.warning("This assignment already exists", { position: "top-center" });
      return;
    }

    dispatch(assignTeacherToClassSubject({ 
      teacherId: Number(teacherId), 
      classId, 
      subjectId 
    }));
  };

  const handleEdit = (assignmentId: number, currentClassId: number, currentSubjectId: number) => {
    setEditAssignmentId(assignmentId);
    setEditClassId(currentClassId);
    setEditSubjectId(currentSubjectId);
  };

  const handleUpdate = () => {
    if (editAssignmentId !== null && editClassId !== null && editSubjectId !== null) {
      dispatch(
        updateTeacherAssignment({
          assignmentId: editAssignmentId,
          classId: editClassId,
          subjectId: editSubjectId,
        })
      );
      setEditAssignmentId(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAssignmentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteTeacherAssignment(assignmentToDelete))
        .unwrap()
        .then(() => {
          toast.success("Assignment deleted successfully", { position: "top-center" });
          if (teacherId) {
            dispatch(fetchTeacherAssignments(Number(teacherId)));
          }
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete assignment", { position: "top-center" });
        });
    }
    setDeleteConfirmOpen(false);
  };

  const selectedTeacher = teachers.find(t => t.id === teacherId);

  return (
    <Paper sx={{ 
      p: 4, 
      borderRadius: 4,
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      background: "linear-gradient(to bottom, #f9fafb, #ffffff)"
    }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Class />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Teacher Assignment Manager
        </Typography>
      </Stack>

      {loading && <CircularProgress sx={{ my: 2 }} />}

      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Teacher</InputLabel>
                <Select
                  value={teacherId}
                  label="Select Teacher"
                  onChange={(e) => setTeacherId(Number(e.target.value))}
                  startAdornment={
                    <Person color="action" sx={{ mr: 1 }} />
                  }
                >
                  {teachers.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                          {t.fullName.charAt(0)}
                        </Avatar>
                        <span>{t.fullName}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {teacherId && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={classId}
                      label="Class"
                      onChange={(e) => setClassId(Number(e.target.value))}
                      startAdornment={
                        <Class color="action" sx={{ mr: 1 }} />
                      }
                    >
                      {mockClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subjectId}
                      label="Subject"
                      onChange={(e) => setSubjectId(Number(e.target.value))}
                      startAdornment={
                        <Book color="action" sx={{ mr: 1 }} />
                      }
                    >
                      {mockSubjects.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                          <Chip 
                            label={sub.name} 
                            size="small" 
                            color={sub.color as any} 
                            sx={{ mr: 1 }} 
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>

          {teacherId && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button 
                variant="contained" 
                onClick={handleAssign}
                startIcon={<Add />}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16
                }}
              >
                Create Assignment
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {teacherId && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar 
                alt={selectedTeacher?.fullName} 
                src={selectedTeacher?.avatar} 
                sx={{ width: 56, height: 56 }}
              >
                {selectedTeacher?.fullName.charAt(0)}
              </Avatar>
              <div>
                <Typography variant="h6" fontWeight={600}>
                  {selectedTeacher?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Assignments
                </Typography>
              </div>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {assignments.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No assignments found for this teacher
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {assignments.map((a) => (
                  <Grid item xs={12} sm={6} md={4} key={a.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        borderLeft: `4px solid ${editAssignmentId === a.id ? 'primary.main' : 'transparent'}`
                      }}
                    >
                      {editAssignmentId === a.id ? (
                        <Stack spacing={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Class</InputLabel>
                            <Select
                              value={editClassId}
                              onChange={(e) => setEditClassId(Number(e.target.value))}
                            >
                              {mockClasses.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                  {cls.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size="small">
                            <InputLabel>Subject</InputLabel>
                            <Select
                              value={editSubjectId}
                              onChange={(e) => setEditSubjectId(Number(e.target.value))}
                            >
                              {mockSubjects.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                  {s.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setEditAssignmentId(null)}
                              startIcon={<Close />}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={handleUpdate}
                              startIcon={<Save />}
                            >
                              Save
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Chip 
                              label={a.className} 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                            <Stack direction="row">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(a.id, a.classId, a.subjectId)}
                                color="primary"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(a.id)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                          <Typography variant="body1" fontWeight={500}>
                            {a.subjectName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Assigned on {new Date().toLocaleDateString()}
                          </Typography>
                        </Stack>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this assignment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TeacherAssignmentManager;