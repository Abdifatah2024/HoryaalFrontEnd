import React, { useEffect, useRef } from "react";
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
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentBalanceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.studentBalance);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchStudentsWithBalancesAndMonths());
  }, [dispatch]);

  const handleExportExcel = () => {
    const rows = students.map((student) => ({
      "Full Name": student.fullname,
      "Class": student.className,
      "Balance": student.balance,
      "Carry Forward": student.carryForward,
      "Months Due": student.monthsDue
        .map(
          (m) =>
            `${new Date(m.year, m.month - 1).toLocaleString("default", {
              month: "short",
            })}/${m.year} - $${m.due}`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unpaid Students");
    XLSX.writeFile(workbook, "UnpaidStudents.xlsx");
  };

const handleExportPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Unpaid Students Balance Report", 105, 20, { align: "center" });

  // Define table rows
  const tableData = students.map((student, index) => [
    index + 1,
    student.fullname,
    student.className,
    `$${student.balance}`,
    `$${student.carryForward}`,
    student.monthsDue
      .map(
        (m) =>
          `${new Date(m.year, m.month - 1).toLocaleString("default", {
            month: "short",
          })}/${m.year} - $${m.due}`
      )
      .join(", "),
  ]);

  autoTable(doc, {
    startY: 30,
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
      fillColor: [52, 73, 94], // dark gray-blue
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    tableLineColor: [44, 62, 80],
    tableLineWidth: 0.2,
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 10 }, // #
      1: { cellWidth: 40 }, // Full Name
      2: { cellWidth: 25 }, // Class
      3: { cellWidth: 20 }, // Balance
      4: { cellWidth: 25 }, // Carry Forward
      5: { cellWidth: 70 }, // Unpaid Months
    },
  });

  doc.save("UnpaidStudentsReport.pdf");
};


  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const printWindow = window.open("", "", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Print</title></head><body>");
        printWindow.document.write(content);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Students with Unpaid Balances
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleExportExcel}>
          Export Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExportPDF}>
          Export PDF
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          Print
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
                {students.map((student, index) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>${student.balance}</TableCell>
                    <TableCell>${student.carryForward}</TableCell>
                    <TableCell>
                      {student.monthsDue.map((m, i) => (
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
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No unpaid students found.
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
