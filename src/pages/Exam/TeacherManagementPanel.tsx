import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Delete,
  Edit,
  Save,
  Cancel,
  Add,
  School,
  Assignment,
  Gavel,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchAllTeachers,
  fetchTeacherCorrectionStatus,
  setTeacherCorrectionLimit,
  fetchTeacherAssignments,
  assignTeacherToClassSubject,
  updateTeacherAssignment,
  deleteTeacherAssignment,
  clearTeacherManagementState,
} from "../../Redux/Exam/teacherManagementSlice";

const mockClasses = [
  { id: 1, name: "1A" },
  { id: 2, name: "1B" },
  { id: 3, name: "1C" },
  { id: 4, name: "2A" },
  { id: 5, name: "2B" },
  { id: 7, name: "2C" },
  { id: 8, name: "2D" },
  { id: 9, name: "2E" },
  { id: 10, name: "2F" },
  { id: 11, name: "3A" },
  { id: 12, name: "3B" },
  { id: 13, name: "3C" },
  { id: 14, name: "3D" },
  { id: 15, name: "4A" },
  { id: 16, name: "4B" },
  { id: 17, name: "4C" },
  { id: 18, name: "4D" },
];

const mockSubjects = [
  { id: 1, name: "Chemistry", color: "primary" },
  { id: 2, name: "Biology", color: "success" },
  { id: 3, name: "Physics", color: "warning" },
  { id: 4, name: "Mathematics", color: "error" },
  { id: 5, name: "English", color: "info" },
  { id: 6, name: "Arabic", color: "info" },
  { id: 7, name: "Islamic", color: "secondary" },
  { id: 8, name: "Geography", color: "primary" },
  { id: 9, name: "History", color: "secondary" },
  { id: 10, name: "Somali", color: "info" },
];

const TeacherManagementPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    teachers,
    correctionLimit,
    correctionsUsed,
    remaining,
    assignments,
    loading,
    error,
    success,
  } = useSelector((state: RootState) => state.teacherManagement);

  const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");
  const [newLimit, setNewLimit] = useState<number>(0);
  const [classId, setClassId] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<number>(1);

  const [editAssignmentId, setEditAssignmentId] = useState<number | null>(null);
  const [editClassId, setEditClassId] = useState<number | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(clearTeacherManagementState());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTeacherId) {
      dispatch(fetchTeacherCorrectionStatus(Number(selectedTeacherId)));
      dispatch(fetchTeacherAssignments(Number(selectedTeacherId)));
    }
  }, [dispatch, selectedTeacherId]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  const handleAssign = () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher");
      return;
    }

    const duplicate = assignments.some(
      (a) => a.classId === classId && a.subjectId === subjectId
    );
    if (duplicate) {
      toast.warning("Assignment already exists");
      return;
    }

    dispatch(assignTeacherToClassSubject({ teacherId: Number(selectedTeacherId), classId, subjectId }));
  };

  const handleUpdateLimit = () => {
    if (!selectedTeacherId || !newLimit) {
      toast.error("Please enter valid limit and select a teacher");
      return;
    }

    dispatch(setTeacherCorrectionLimit({ userId: Number(selectedTeacherId), correctionLimit: newLimit }))
      .then(() => {
        dispatch(fetchTeacherCorrectionStatus(Number(selectedTeacherId)));
      });
  };

  const handleUpdateAssignment = () => {
    if (editAssignmentId && editClassId && editSubjectId) {
      dispatch(updateTeacherAssignment({ assignmentId: editAssignmentId, classId: editClassId, subjectId: editSubjectId }));
      setEditAssignmentId(null);
    }
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      dispatch(deleteTeacherAssignment(confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <School />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Teacher Management
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Teacher Selection Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 1 }} />
                Teacher Selection
              </Typography>
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Select Teacher</InputLabel>
                <Select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  label="Select Teacher"
                >
                  {teachers.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedTeacher && (
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedTeacher.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTeacher.email}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Correction Limit Card */}
        {selectedTeacherId && (
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" mb={2} display="flex" alignItems="center">
                  <Gavel color="primary" sx={{ mr: 1 }} />
                  Correction Management
                </Typography>
                
                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={4}>
                        <Paper elevation={0} sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: 'primary.light',
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Limit
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {correctionLimit}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper elevation={0} sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: 'warning.light',
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Used
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {correctionsUsed}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper elevation={0} sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: 'success.light',
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Remaining
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {remaining}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        label="New Correction Limit"
                        type="number"
                        size="small"
                        fullWidth
                        value={newLimit}
                        onChange={(e) => setNewLimit(Number(e.target.value))}
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleUpdateLimit}
                        sx={{ height: '40px' }}
                      >
                        Update
                      </Button>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Assignment Section */}
      {selectedTeacherId && (
        <Box mt={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 1 }} />
                Class Assignments
              </Typography>

              <Paper elevation={0} sx={{ 
                p: 2, 
                mb: 3,
                bgcolor: 'background.default',
                borderRadius: 2
              }}>
                <Typography variant="subtitle1" mb={2}>
                  Create New Assignment
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={classId}
                        onChange={(e) => setClassId(Number(e.target.value))}
                        label="Class"
                      >
                        {mockClasses.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Subject</InputLabel>
                      <Select
                        value={subjectId}
                        onChange={(e) => setSubjectId(Number(e.target.value))}
                        label="Subject"
                      >
                        {mockSubjects.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAssign}
                      sx={{ height: '40px' }}
                    >
                      Assign
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" mb={2}>
                Current Assignments ({assignments.length})
              </Typography>
              
              {assignments.length === 0 ? (
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 2
                }}>
                  <Typography color="text.secondary">
                    No assignments found for this teacher
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {assignments.map((a) => (
                    <Grid item xs={12} sm={6} md={4} key={a.id}>
                      <Paper sx={{ 
                        p: 2, 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main'
                      }}>
                        {editAssignmentId === a.id ? (
                          <Stack direction="row" spacing={1} alignItems="center" width="100%">
                            <FormControl size="small" sx={{ flex: 1 }}>
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
                            <FormControl size="small" sx={{ flex: 1 }}>
                              <Select
                                value={editSubjectId}
                                onChange={(e) => setEditSubjectId(Number(e.target.value))}
                              >
                                {mockSubjects.map((sub) => (
                                  <MenuItem key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Tooltip title="Save">
                              <IconButton color="primary" onClick={handleUpdateAssignment}>
                                <Save fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton color="warning" onClick={() => setEditAssignmentId(null)}>
                                <Cancel fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <>
                            <Box>
                              <Chip 
                                label={a.className} 
                                sx={{ mr: 1, fontWeight: 600 }} 
                                size="small"
                              />
                              <Chip 
                                label={a.subjectName} 
                                color="secondary" 
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            <Box>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => {
                                    setEditAssignmentId(a.id);
                                    setEditClassId(a.classId);
                                    setEditSubjectId(a.subjectId);
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => setConfirmDeleteId(a.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog 
        open={!!confirmDeleteId} 
        onClose={() => setConfirmDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this assignment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDeleteId(null)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherManagementPanel;