// import React, { useEffect, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import { fetchStudentsWithBalancesAndMonths } from "../../Redux/Payment/studentBalanceSlice";
// import {
//   CircularProgress,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Box,
//   Chip,
//   Button,
//   Stack,
// } from "@mui/material";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const StudentBalanceList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { students, loading, error } = useAppSelector((state) => state.studentBalance);
//   const printRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     dispatch(fetchStudentsWithBalancesAndMonths());
//   }, [dispatch]);

//   const handleExportExcel = () => {
//     const rows = students.map((student) => ({
//       "Full Name": student.fullname,
//       "Class": student.className,
//       "Balance": student.balance,
//       "Carry Forward": student.carryForward,
//       "Months Due": student.monthsDue
//         .map(
//           (m) =>
//             `${new Date(m.year, m.month - 1).toLocaleString("default", {
//               month: "short",
//             })}/${m.year} - $${m.due}`
//         )
//         .join(", "),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Unpaid Students");
//     XLSX.writeFile(workbook, "UnpaidStudents.xlsx");
//   };

// const handleExportPDF = () => {
//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.text("Unpaid Students Balance Report", 105, 20, { align: "center" });

//   // Define table rows
//   const tableData = students.map((student, index) => [
//     index + 1,
//     student.fullname,
//     student.className,
//     `$${student.balance}`,
//     `$${student.carryForward}`,
//     student.monthsDue
//       .map(
//         (m) =>
//           `${new Date(m.year, m.month - 1).toLocaleString("default", {
//             month: "short",
//           })}/${m.year} - $${m.due}`
//       )
//       .join(", "),
//   ]);

//   autoTable(doc, {
//     startY: 30,
//     head: [["#", "Full Name", "Class", "Balance", "Carry Forward", "Unpaid Months"]],
//     body: tableData,
//     styles: {
//       halign: "center",
//       valign: "middle",
//       fontSize: 9,
//       cellPadding: 3,
//       lineColor: [44, 62, 80],
//       lineWidth: 0.2,
//     },
//     headStyles: {
//       fillColor: [52, 73, 94], // dark gray-blue
//       textColor: [255, 255, 255],
//       fontStyle: "bold",
//     },
//     alternateRowStyles: {
//       fillColor: [245, 245, 245],
//     },
//     tableLineColor: [44, 62, 80],
//     tableLineWidth: 0.2,
//     theme: "grid",
//     columnStyles: {
//       0: { cellWidth: 10 }, // #
//       1: { cellWidth: 40 }, // Full Name
//       2: { cellWidth: 25 }, // Class
//       3: { cellWidth: 20 }, // Balance
//       4: { cellWidth: 25 }, // Carry Forward
//       5: { cellWidth: 70 }, // Unpaid Months
//     },
//   });

//   doc.save("UnpaidStudentsReport.pdf");
// };


//   const handlePrint = () => {
//     if (printRef.current) {
//       const content = printRef.current.innerHTML;
//       const printWindow = window.open("", "", "width=900,height=700");
//       if (printWindow) {
//         printWindow.document.write("<html><head><title>Print</title></head><body>");
//         printWindow.document.write(content);
//         printWindow.document.write("</body></html>");
//         printWindow.document.close();
//         printWindow.print();
//       }
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Students with Unpaid Balances
//       </Typography>

//       <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleExportExcel}>
//           Export Excel
//         </Button>
//         <Button variant="contained" color="secondary" onClick={handleExportPDF}>
//           Export PDF
//         </Button>
//         <Button variant="contained" onClick={handlePrint}>
//           Print
//         </Button>
//       </Stack>

//       {loading && (
//         <Box display="flex" justifyContent="center" mt={4}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Typography color="error" sx={{ mt: 2 }}>
//           {error}
//         </Typography>
//       )}

//       {!loading && !error && (
//         <div ref={printRef}>
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>#</TableCell>
//                   <TableCell>Full Name</TableCell>
//                   <TableCell>Class</TableCell>
//                   <TableCell>Balance</TableCell>
//                   <TableCell>Carry Forward</TableCell>
//                   <TableCell>Unpaid Months</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {students.map((student, index) => (
//                   <TableRow key={student.studentId}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.fullname}</TableCell>
//                     <TableCell>{student.className}</TableCell>
//                     <TableCell>${student.balance}</TableCell>
//                     <TableCell>${student.carryForward}</TableCell>
//                     <TableCell>
//                       {student.monthsDue.map((m, i) => (
//                         <Chip
//                           key={i}
//                           label={`${
//                             new Date(m.year, m.month - 1).toLocaleString("default", {
//                               month: "short",
//                             })
//                           }/${m.year} - $${m.due}`}
//                           size="small"
//                           sx={{ mr: 0.5, mb: 0.5 }}
//                           color="warning"
//                         />
//                       ))}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {students.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center">
//                       No unpaid students found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default StudentBalanceList;
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchStudentsWithBalancesAndMonths } from "../../Redux/Payment/studentBalanceSlice";
import {
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ALL = "ALL";

const StudentBalanceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.studentBalance);
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedClass, setSelectedClass] = useState<string>(ALL);

  useEffect(() => {
    dispatch(fetchStudentsWithBalancesAndMonths());
  }, [dispatch]);

  // 🔹 Build class options purely from UI data (no backend calls)
  const classOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return [ALL, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [students]);

  // 🔹 UI-only filter
  const filteredStudents = useMemo(() => {
    if (selectedClass === ALL) return students;
    return students.filter((s) => s.className === selectedClass);
  }, [students, selectedClass]);

  const titleSuffix = selectedClass === ALL ? " (All Classes)" : ` (${selectedClass})`;

  const handleExportExcel = () => {
    const rows = filteredStudents.map((student) => ({
      "Full Name": student.fullname,
      Class: student.className,
      Balance: student.balance,
      "Carry Forward": student.carryForward,
      "Months Due": student.monthsDue
        .map(
          (m: { month: number; year: number; due: number }) =>
            `${new Date(m.year, m.month - 1).toLocaleString("default", {
              month: "short",
            })}/${m.year} - $${m.due}`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unpaid Students");
    const filename = selectedClass === ALL ? "UnpaidStudents_All.xlsx" : `UnpaidStudents_${selectedClass}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Unpaid Students Balance Report${titleSuffix}`, 105, 16, { align: "center" });

    // Meta
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

    // Table
    const tableData = filteredStudents.map((student, index) => [
      index + 1,
      student.fullname,
      student.className,
      `$${student.balance}`,
      `$${student.carryForward}`,
      student.monthsDue
        .map(
          (m: { month: number; year: number; due: number }) =>
            `${new Date(m.year, m.month - 1).toLocaleString("default", {
              month: "short",
            })}/${m.year} - $${m.due}`
        )
        .join(", "),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [["#", "Full Name", "Class", "Balance", "Carry Forward", "Unpaid Months"]],
      body: tableData,
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 9,
        cellPadding: 3,
        lineColor: [44, 62, 80],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableLineColor: [44, 62, 80],
      tableLineWidth: 0.2,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 48 },
        2: { cellWidth: 22 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 65 },
      },
      didDrawPage: () => {
        const str = `Page ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(9);
        doc.text(str, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 8);
      },
    });

    const filename = selectedClass === ALL ? "UnpaidStudents_All.pdf" : `UnpaidStudents_${selectedClass}.pdf`;
    doc.save(filename);
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Print${titleSuffix}</title>
            <style>
              @media print {
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #333; padding: 6px; }
                thead th { background: #eee; }
              }
              body { font-family: Arial, sans-serif; padding: 12px; }
              h2 { margin: 0 0 12px; }
            </style>
          </head>
          <body>
            <h2>Unpaid Students Balance Report${titleSuffix}</h2>
            ${content}
          </body>
        </html>
      `);
      win.document.close();
      win.focus();
      win.print();
      win.close();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Students with Unpaid Balances</Typography>

        {/* 🔹 UI-only Class Filter */}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="class-filter-label">Filter by Class (UI)</InputLabel>
          <Select
            labelId="class-filter-label"
            label="Filter by Class (UI)"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classOptions.map((name) => (
              <MenuItem key={name} value={name}>
                {name === ALL ? "All Classes" : name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleExportExcel}>
          Export Excel ({selectedClass === ALL ? "All" : selectedClass})
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExportPDF}>
          Export PDF ({selectedClass === ALL ? "All" : selectedClass})
        </Button>
        <Button variant="contained" color="success" onClick={handlePrint}>
          Print ({selectedClass === ALL ? "All" : selectedClass})
        </Button>
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <div ref={printRef}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Carry Forward</TableCell>
                  <TableCell>Unpaid Months</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>${student.balance}</TableCell>
                    <TableCell>${student.carryForward}</TableCell>
                    <TableCell>
                      {student.monthsDue.map(
                        (m: { month: number; year: number; due: number }, i: number) => (
                          <Chip
                            key={i}
                            label={`${
                              new Date(m.year, m.month - 1).toLocaleString("default", {
                                month: "short",
                              })
                            }/${m.year} - $${m.due}`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            color="warning"
                          />
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No unpaid students found
                      {selectedClass !== ALL ? ` for class ${selectedClass}` : ""}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Container>
  );
};

export default StudentBalanceList;
