// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../Redux/store";
// import { fetchNewlyRegisteredStudents } from "../../pages/Payment/unpaidFamilySlice";

// const NewStudentList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { loading, newStudents, error } = useSelector(
//     (state: RootState) => state.unpaidFamily
//   );

//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");

//   const handleSubmit = () => {
//     if (!startDate || !endDate) {
//       alert("Please enter both start and end dates.");
//       return;
//     }

//     dispatch(fetchNewlyRegisteredStudents({ startDate, endDate }));
//   };

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h5" gutterBottom mt={4}>
//         Newly Registered Students
//       </Typography>

//       <Box display="flex" gap={2} my={2}>
//         <TextField
//           label="Start Date"
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//         />
//         <TextField
//           label="End Date"
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           sx={{ minWidth: "150px" }}
//         >
//           Search
//         </Button>
//       </Box>

//       {loading && (
//         <Box textAlign="center" my={4}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Typography color="error" mt={2}>
//           {error}
//         </Typography>
//       )}

//       {!loading && newStudents.length > 0 && (
//         <Paper elevation={3} sx={{ mt: 3 }}>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Full Name</TableCell>
//                   <TableCell>Phone</TableCell>
//                   <TableCell>Gender</TableCell>
//                   <TableCell>Class</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {newStudents.map((student, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{student.fullname}</TableCell>
//                     <TableCell>{student.phone}</TableCell>
//                     <TableCell>{student.gender}</TableCell>
//                     <TableCell>{student.className}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}

//       {!loading && newStudents.length === 0 && (
//         <Typography mt={2}>No students found in the selected range.</Typography>
//       )}
//     </Container>
//   );
// };

// export default NewStudentList;
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchNewlyRegisteredStudents } from "../../pages/Payment/unpaidFamilySlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Keep this in sync with your slice
export interface NewStudent {
  fullname: string;
  phone: string;
  gender: string;
  address: string;
  className: string;
  createdAt?: string;
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const todayStamp = () => new Date().toLocaleString();

const NewStudentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, newStudents, error } = useAppSelector(
    (state) => state.unpaidFamily
  );

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [autoPrint, setAutoPrint] = useState<boolean>(false);

  const total = newStudents.length;

  const periodLabel = useMemo(() => {
    if (!startDate || !endDate) return "—";
    return `${startDate} → ${endDate}`;
  }, [startDate, endDate]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Please enter both start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be the same or after the start date.");
      return;
    }
    dispatch(fetchNewlyRegisteredStudents({ startDate, endDate }));
  };

  const buildPdf = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Header
    doc.setFontSize(14);
    doc.text("Newly Registered Students", 14, 16);
    doc.setFontSize(10);
    doc.text(`Period: ${periodLabel}`, 14, 22);
    doc.text(`Generated At: ${todayStamp()}`, 14, 27);
    doc.text(`Total: ${total}`, 14, 32);

    // Table
    const head = [["#", "Full Name", "Phone", "Gender", "Class", "Address", "Registered At"]];
    const body = newStudents.map((s: NewStudent, idx: number) => [
      String(idx + 1),
      s.fullname || "",
      s.phone || "",
      s.gender || "",
      s.className || "",
      s.address || "N/A",
      formatDateTime(s.createdAt),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 36,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { halign: "left" },
      bodyStyles: { valign: "middle" },
      columnStyles: {
        0: { cellWidth: 8 },   // #
        1: { cellWidth: 45 },  // name
        2: { cellWidth: 26 },  // phone
        3: { cellWidth: 18 },  // gender
        4: { cellWidth: 22 },  // class
        5: { cellWidth: 40 },  // address
        6: { cellWidth: 27 },  // registered at
      },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 8
        );
      },
    });

    return doc;
  };

  const handleDownloadPdf = () => {
    if (newStudents.length === 0) {
      alert("No data to export.");
      return;
    }
    const doc = buildPdf();
    const filename = `new_students_${startDate}_to_${endDate}.pdf`;
    doc.save(filename);
  };

  const handlePrintPdf = () => {
    if (newStudents.length === 0) {
      alert("No data to print.");
      return;
    }
    const doc = buildPdf();
    doc.autoPrint();
    doc.output("dataurlnewwindow");
  };

  // Auto-print when results load (if enabled)
  useEffect(() => {
    if (!loading && autoPrint && newStudents.length > 0) {
      handlePrintPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, newStudents, autoPrint]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom mt={4}>
        Newly Registered Students
      </Typography>

      <Box display="flex" gap={2} my={2} flexWrap="wrap" alignItems="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 220 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ minWidth: 150 }}
        >
          Search
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={autoPrint}
              onChange={(e) => setAutoPrint(e.target.checked)}
            />
          }
          label="Auto print after search"
        />
      </Box>

      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {!loading && newStudents.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
            <Typography variant="subtitle2">Period: {periodLabel}</Typography>
            <Typography variant="subtitle2">Total: {newStudents.length}</Typography>
          </Box>

          <Paper elevation={3}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Registered At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newStudents.map((s: NewStudent, idx: number) => (
                    <TableRow key={`${s.fullname}-${idx}`} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{s.fullname}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>{s.gender}</TableCell>
                      <TableCell>{s.className}</TableCell>
                      <TableCell>{s.address || "N/A"}</TableCell>
                      <TableCell>{formatDateTime(s.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" onClick={handleDownloadPdf}>
              Download PDF
            </Button>
            <Button variant="contained" onClick={handlePrintPdf}>
              Print PDF
            </Button>
          </Box>
        </>
      )}

      {!loading && !error && newStudents.length === 0 && (
        <Typography mt={2}>No students found in the selected range.</Typography>
      )}
    </Container>
  );
};

export default NewStudentList;
