import React, { useEffect, useState, useRef } from "react"; // Added useState, useRef
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import { fetchRestoredStudents } from "./studentSoftDeleteSlice"; // Assuming this slice handles restored students too
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Container, // For overall layout
  Button,    // For action buttons
  Stack,     // For arranging buttons and filters
  FormControl, // For dropdown filter
  InputLabel,  // For dropdown label
  Select,      // For dropdown
  MenuItem,    // For dropdown options
} from "@mui/material";
import { toast } from "react-toastify"; // For notifications

// Import Icons
import {
  Refresh as RefreshIcon,
  PictureAsPdf as PictureAsPdfIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon, // For empty state icon
} from '@mui/icons-material';

// PDF generation libraries
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Define Student interface (ensure it matches your Redux state structure)
// interface Student {
//   studentId: number;
//   fullName: string;
//   className: string;
//   reason: string;
//   deletedAt: string;
//   restoredAt: string;
//   deletedBy?: { name: string; email: string }; // Optional, as per your slice, can be undefined
//   restoredBy?: { name: string; email: string }; // Optional, as per your slice, can be undefined
// }

const RestoredStudentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    restoredStudents,
    loading,
    error,
  } = useSelector((state: RootState) => state.studentSoftDelete);

  const [filterClass, setFilterClass] = useState<string>(''); // State for class filter
  const tableRef = useRef<HTMLDivElement>(null); // Ref for table container for PDF export

  useEffect(() => {
    dispatch(fetchRestoredStudents());
  }, [dispatch]);

  // Handle refresh button click
  const handleRefresh = () => {
    dispatch(fetchRestoredStudents());
    setFilterClass(''); // Clear filter on refresh
  };

  // Handle PDF generation and printing
  const handleGeneratePdfAndPrint = async () => {
    // Basic check for libraries
    if (typeof html2canvas === 'undefined' || typeof jsPDF === 'undefined') {
      toast.error("PDF generation libraries (html2canvas, jspdf) are not loaded. Please ensure they are installed.");
      console.error("PDF generation libraries (html2canvas, jspdf) not found.");
      return;
    }

    if (tableRef.current) {
      toast.info("Generating PDF...");
      try {
        const canvas = await html2canvas(tableRef.current, { scale: 2 }); // Scale for better resolution
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Open PDF in new tab
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        URL.revokeObjectURL(pdfUrl); // Clean up the URL object

        toast.success("PDF generated successfully!");

      } catch (err: any) {
        console.error("Error generating PDF:", err);
        toast.error(`Failed to generate PDF: ${err.message || "Unknown error"}. Please ensure html2canvas and jspdf are installed.`);
      }
    } else {
      toast.error("Table content not found for PDF generation.");
    }
  };

  // Get unique class names for the dropdown filter
  const uniqueClasses = Array.from(new Set(restoredStudents.map(student => student.className))).sort();

  // Filter students based on the selected class
  const filteredStudents = restoredStudents.filter(student =>
    filterClass === '' || student.className === filterClass
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
          Restored Students Records
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Button
            variant="outlined"
            color="info"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: { xs: '100%', sm: 'auto' }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Refresh List"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGeneratePdfAndPrint}
            startIcon={<PictureAsPdfIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: { xs: '100%', sm: 'auto' }
            }}
            disabled={filteredStudents.length === 0} // Disable if no data to export
          >
            Export to PDF / Print
          </Button>

          {/* Class Filter Dropdown */}
          <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel id="class-filter-label">Filter by Class</InputLabel>
            <Select
              labelId="class-filter-label"
              id="class-filter"
              value={filterClass}
              label="Filter by Class"
              onChange={(e) => setFilterClass(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>All Classes</em>
              </MenuItem>
              {uniqueClasses.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>


        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading restored students...</Typography>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        {!loading && filteredStudents.length === 0 && !error && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py={5}
            sx={{ color: 'text.secondary' }}
          >
            <AssignmentTurnedInIcon sx={{ fontSize: 60, mb: 2, color: 'grey.400' }} />
            <Typography variant="h6">No restored students found.</Typography>
            {filterClass && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Adjust your class filter or refresh the list.
              </Typography>
            )}
          </Box>
        )}

        {!loading && filteredStudents.length > 0 && (
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflowX: 'auto' }} ref={tableRef}>
            <Table size="small" aria-label="restored students table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Deleted At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Restored At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Deleted By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Restored By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' } }}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.reason}</TableCell>
                    <TableCell>{new Date(student.deletedAt).toLocaleString()}</TableCell>
                    <TableCell>{new Date(student.restoredAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {student.deletedBy?.name} <br />
                      <Typography variant="caption" color="text.secondary">{student.deletedBy?.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {student.restoredBy?.name} <br />
                      <Typography variant="caption" color="text.secondary">{student.restoredBy?.email}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default RestoredStudentsPage;