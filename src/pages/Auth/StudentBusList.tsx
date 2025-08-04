import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure this is correctly imported
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchStudentsWithBus,
  fetchStudentsWithoutBus,
} from "../../Redux/studentBusSlice";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  School,
  DirectionsBus,
  Paid,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// Expected bus fee per student
const EXPECTED_BUS_FEE = 10;

// Helper function for currency formatting
const formatCurrency = (amount: number): string => {
  // Ensure amount is a number, default to 0 if not
  const numAmount = typeof amount === 'number' ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount);
};

interface Student {
  id: string | number;
  fullname: string;
  classes: {
    name: string;
  };
  totalFee: number;
  schoolFee: number;
  busFee: number;
  phone?: string;
  FreeReason?: string;
}

const StudentBusList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { withBus, withoutBus, loading, error } = useAppSelector(
    (state) => state.studentBus
  );

  const [filterTextWithBus, setFilterTextWithBus] = useState("");
  const [filterTextWithoutBus, setFilterTextWithoutBus] = useState("");

  useEffect(() => {
    dispatch(fetchStudentsWithBus());
    dispatch(fetchStudentsWithoutBus());
  }, [dispatch]);

  const [grandTotals, busFeeAnalysis] = useMemo(() => {
  const calculateTotals = (students: Student[]) => ({
    totalFee: students.reduce((sum, student) => sum + student.totalFee, 0),
    schoolFee: students.reduce((sum, student) => sum + student.schoolFee, 0),
    busFee: students.reduce((sum, student) => sum + student.busFee, 0),
    count: students.length,
  });

  const withTotals = calculateTotals(withBus);
  const withoutTotals = calculateTotals(withoutBus);

  const grandTotals = {
    totalFee: withTotals.totalFee + withoutTotals.totalFee,
    schoolFee: withTotals.schoolFee + withoutTotals.schoolFee,
    busFee: withTotals.busFee + withoutTotals.busFee,
    count: withTotals.count + withoutTotals.count,
  };

  const expectedBusFee = withBus.length * EXPECTED_BUS_FEE;
  const actualBusFee = withTotals.busFee;
  const busFeeDifference = expectedBusFee - actualBusFee;
  const busFeeCompliance =
    expectedBusFee > 0 ? (actualBusFee / expectedBusFee) * 100 : 100;

  const busFeeAnalysis = {
    expected: expectedBusFee,
    actual: actualBusFee,
    difference: busFeeDifference,
    compliance: busFeeCompliance,
    expectedPerStudent: EXPECTED_BUS_FEE,
  };

  return [grandTotals, busFeeAnalysis];
}, [withBus, withoutBus]);


  const filteredWithBus = useMemo(() => {
    return withBus.filter(
      (student) =>
        student.fullname
          .toLowerCase()
          .includes(filterTextWithBus.toLowerCase()) ||
        student.classes.name
          .toLowerCase()
          .includes(filterTextWithBus.toLowerCase())
    );
  }, [withBus, filterTextWithBus]);

  const filteredWithoutBus = useMemo(() => {
    return withoutBus.filter(
      (student) =>
        student.fullname
          .toLowerCase()
          .includes(filterTextWithoutBus.toLowerCase()) ||
        student.classes.name
          .toLowerCase()
          .includes(filterTextWithoutBus.toLowerCase())
    );
  }, [withoutBus, filterTextWithoutBus]);

  // --- PDF Generation Functions for Detailed Lists ---
  const generateListPdf = (
    data: Student[],
    title: string,
    isBusServiceTable: boolean,
    action: "download" | "print"
  ) => {
    console.log(`[List PDF] Generating for: ${title}, action: ${action}`);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(title, 14, 20);

      const headers = isBusServiceTable
        ? ["Full Name", "Class", "Total Fee", "School Fee", "Bus Fee", "Fee Status"]
        : ["Full Name", "Class", "Total Fee", "School Fee", "Bus Fee"];

      const tableData = data.map((student) => {
        const row = [
          student.fullname,
          student.classes.name,
          formatCurrency(student.totalFee),
          formatCurrency(student.schoolFee),
          formatCurrency(student.busFee),
        ];
        if (isBusServiceTable) {
          let feeStatus = "";
          if (student.busFee >= EXPECTED_BUS_FEE) {
            feeStatus = "Full";
          } else if (student.busFee > 0) {
            feeStatus = "Partial";
          } else {
            feeStatus = "None";
          }
          row.push(feeStatus);
        }
        return row;
      });

      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        theme: "striped",
        headStyles: {
          fillColor: [66, 135, 245],
          textColor: 255,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        columnStyles: {
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: isBusServiceTable ? { halign: 'center' } : {},
        },
     didDrawPage: (data) => {
  const pageNumber = doc.getNumberOfPages(); // correct & type-safe
  doc.setFontSize(8);
  doc.text(`Page ${pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
}
      });

      if (action === "download") {
        doc.save(`${title.replace(/\s/g, "_")}.pdf`);
        console.log("[List PDF] PDF saved successfully.");
      } else if (action === "print") {
        doc.output("dataurlnewwindow");
        console.log("[List PDF] PDF sent to new window for printing.");
      }
    } catch (e) {
  console.error("[List PDF] Error generating list PDF:", e);
  if (e instanceof Error) {
    alert(`Failed to generate list PDF: ${e.message}. Check console for details.`);
  } else {
    alert("Failed to generate list PDF. Unknown error.");
  }
}

  };

  const handleDownloadWithBusPdf = () => {
    generateListPdf(
      filteredWithBus,
      "Students With Bus Service",
      true,
      "download"
    );
  };

  const handlePrintWithBusPdf = () => {
    generateListPdf(
      filteredWithBus,
      "Students With Bus Service",
      true,
      "print"
    );
  };

  const handleDownloadWithoutBusPdf = () => {
    generateListPdf(
      filteredWithoutBus,
      "Students Without Bus Service",
      false,
      "download"
    );
  };

  const handlePrintWithoutBusPdf = () => {
    generateListPdf(
      filteredWithoutBus,
      "Students Without Bus Service",
      false,
      "print"
    );
  };

  // --- PDF Generation for Summary ---
  const generateSummaryPdf = (action: "download" | "print") => {
    console.log(`[Summary PDF] Generating summary PDF, action: ${action}`);
    try {
      const doc = new jsPDF();
      let yPos = 20;

      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Bus Service Financial Summary", 105, yPos, { align: 'center' });
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, yPos, { align: 'center' });
      yPos += 20;

      // Overall Totals Table
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Overall Metrics", 14, yPos);
      yPos += 5;

      const overallMetricsBody = [
        ['Total Students', String(grandTotals.count)],
        ['Students with Bus Service', `${withBus.length} (${grandTotals.count > 0 ? Math.round((withBus.length / grandTotals.count) * 100) : 0}%)`],
        ['Students without Bus Service', `${withoutBus.length} (${grandTotals.count > 0 ? Math.round((withoutBus.length / grandTotals.count) * 100) : 0}%)`],
      ];
      console.log("[Summary PDF] Overall Metrics Data:", overallMetricsBody);

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: overallMetricsBody,
        theme: 'grid',
        headStyles: { fillColor: [70, 130, 180], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: { 1: { halign: 'right' } },
        margin: { left: 14, right: 14 }
      });
     if (doc.lastAutoTable?.finalY) {
  yPos = doc.lastAutoTable.finalY + 15;
} else {
  yPos += 15; // fallback in case it's undefined
}
      console.log("[Summary PDF] After Overall Metrics Table, yPos:", yPos);


      // Revenue Breakdown Table
      doc.setFontSize(16);
      doc.text("Revenue Analysis", 14, yPos);
      yPos += 5;

      const revenueDataBody = [
        ['Expected Fee per Student', formatCurrency(EXPECTED_BUS_FEE)],
        ['Total Expected Revenue (from bus users)', formatCurrency(busFeeAnalysis.expected)],
        ['Actual Revenue Collected', formatCurrency(busFeeAnalysis.actual)],
        ['Revenue Difference (Expected - Actual)', busFeeAnalysis.difference <= 0
          ? `+${formatCurrency(Math.abs(busFeeAnalysis.difference))}`
          : `-${formatCurrency(busFeeAnalysis.difference)}`
        ],
        ['Compliance Rate', `${busFeeAnalysis.compliance.toFixed(2)}%`],
      ];
      console.log("[Summary PDF] Revenue Analysis Data:", revenueDataBody);

      autoTable(doc, {
        startY: yPos,
        head: [['Description', 'Amount']],
        body: revenueDataBody,
        theme: 'grid',
        headStyles: { fillColor: [60, 179, 113], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: { 1: { halign: 'right' } },
        margin: { left: 14, right: 14 }
      });
    if (doc.lastAutoTable?.finalY) {
  yPos = doc.lastAutoTable.finalY + 15;
} else {
  yPos += 15; // fallback in case it's undefined
}
      console.log("[Summary PDF] After Revenue Analysis Table, yPos:", yPos);

      // Payment Status Breakdown Table
      doc.setFontSize(16);
      doc.text("Payment Status of Bus Users", 14, yPos);
      yPos += 5;

      const paymentStatusDataBody = [
        ['Status', 'Number of Students'],
        ['Fully Paid', `${withBus.filter(s => s.busFee >= EXPECTED_BUS_FEE).length}`],
        ['Partially Paid', `${withBus.filter(s => s.busFee > 0 && s.busFee < EXPECTED_BUS_FEE).length}`],
        ['Not Paid', `${withBus.filter(s => s.busFee === 0).length}`],
        ['Total Outstanding Bus Fee (from bus users)', formatCurrency(busFeeAnalysis.difference)],
      ];
      console.log("[Summary PDF] Payment Status Data:", paymentStatusDataBody);

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count']],
        body: paymentStatusDataBody,
        theme: 'grid',
        headStyles: { fillColor: [255, 165, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: { 1: { halign: 'right' } },
        margin: { left: 14, right: 14 }
      });
      console.log("[Summary PDF] After Payment Status Table.");

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
      doc.text("© Student Management System", doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });

      if (action === "download") {
        doc.save("Bus_Service_Financial_Summary.pdf");
        console.log("[Summary PDF] Summary PDF saved successfully.");
      } else if (action === "print") {
        doc.output("dataurlnewwindow");
        console.log("[Summary PDF] Summary PDF sent to new window for printing.");
      }
    } catch (e) {
  const error = e as Error;
  console.error("[Summary PDF] Error generating summary PDF:", error);
  alert(`Failed to generate summary PDF: ${error.message}. Check console for details.`);
}

  };

  const handleDownloadSummaryPdf = () => {
    generateSummaryPdf("download");
  };

  const handlePrintSummaryPdf = () => {
    generateSummaryPdf("print");
  };

  // Helper to render the student list inside an AccordionDetails
  const renderStudentTableContent = (
    data: Student[],
    isBusServiceTable: boolean, // To conditionally render "Fee Status" column
  ) => {
    if (data.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No students found matching your criteria.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer
        sx={{
          maxHeight: 400,
          overflowX: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Total Fee
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                School Fee
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Bus Fee
              </TableCell>
              {isBusServiceTable && (
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Fee Status
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student) => (
              <TableRow
                key={student.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { borderBottom: 0 } }}
              >
                <TableCell>{student.fullname}</TableCell>
                <TableCell>{student.classes.name}</TableCell>
                <TableCell align="right">
                  {formatCurrency(student.totalFee)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(student.schoolFee)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: student.busFee > 0 ? "success.dark" : "text.secondary",
                  }}
                >
                  {formatCurrency(student.busFee)}
                </TableCell>
                {isBusServiceTable && (
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={
                        student.busFee >= EXPECTED_BUS_FEE
                          ? "Full"
                          : student.busFee > 0
                          ? "Partial"
                          : "None"
                      }
                      color={
                        student.busFee >= EXPECTED_BUS_FEE
                          ? "success"
                          : student.busFee > 0
                          ? "warning"
                          : "error"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 4,
          minHeight: "80vh",
          alignItems: "center",
          bgcolor: '#f4f6f8'
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 3 }}>
          Loading student bus data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Error Loading Data!
        </Typography>
        <Typography>{error}</Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, mb: 4, bgcolor: 'white', border: '1px solid #e0e0e0' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: 'primary.dark',
            textAlign: 'center',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          Student Bus Service Overview
        </Typography>

        {/* Top-level Summary Cards */}
        <Grid container spacing={3} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={4}
              sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'info.main', color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}
            >
              <School sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Students</Typography>
              <Typography variant="h4" fontWeight="bold">
                {grandTotals.count}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={4}
              sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'primary.main', color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}
            >
              <DirectionsBus sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Bus Service Users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {withBus.length}
                <Typography component="span" variant="body2" ml={1} sx={{ opacity: 0.9 }}>
                  ({grandTotals.count > 0 ? Math.round((withBus.length / grandTotals.count) * 100) : 0}%)
                </Typography>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={4}
              sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'success.main', color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}
            >
              <Paid sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Expected Bus Revenue</Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(busFeeAnalysis.expected)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: busFeeAnalysis.actual >= busFeeAnalysis.expected ? 'success.dark' : 'error.main',
                color: 'white',
                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <Paid sx={{ fontSize: 45, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Actual Bus Revenue</Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(busFeeAnalysis.actual)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Detailed Bus Fee Analysis */}
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, mb: 4, bgcolor: 'white', border: '1px solid #e0e0e0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" mb={3} spacing={2}>
          <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
            <DirectionsBus sx={{ mr: 1.5, color: 'primary.dark', fontSize: 32 }} /> Bus Fee Financial Analysis
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadSummaryPdf}
              sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}
            >
              Download Summary
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PrintIcon />}
              onClick={handlePrintSummaryPdf}
              sx={{ whiteSpace: 'nowrap', minWidth: '100px' }}
            >
              Print Summary
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {/* Revenue Details */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#fbfcfd', border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" gutterBottom color="primary.dark" fontWeight={600} sx={{ mb: 2 }}>Revenue Breakdown</Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Expected Fee per Student:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {formatCurrency(EXPECTED_BUS_FEE)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Students Using Bus:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {withBus.length} students
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Total Expected Revenue:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.dark">
                    {formatCurrency(busFeeAnalysis.expected)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Actual Revenue Collected:</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={busFeeAnalysis.actual >= busFeeAnalysis.expected ? "success.main" : "error.main"}
                  >
                    {formatCurrency(busFeeAnalysis.actual)}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Revenue Difference:</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color={busFeeAnalysis.difference <= 0 ? "success.main" : "error.main"}
                  >
                    {busFeeAnalysis.difference <= 0
                      ? `+${formatCurrency(Math.abs(busFeeAnalysis.difference))}`
                      : `-${formatCurrency(busFeeAnalysis.difference)}`}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Compliance Rate:</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color={
                      busFeeAnalysis.compliance >= 95
                        ? "success.main"
                        : busFeeAnalysis.compliance >= 80
                        ? "warning.main"
                        : "error.main"
                    }
                  >
                    {busFeeAnalysis.compliance.toFixed(1)}%
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Payment Compliance Status */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#fbfcfd', border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" gutterBottom color="secondary.dark" fontWeight={600} sx={{ mb: 2 }}>Payment Status Breakdown</Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "success.main", mr: 1, borderRadius: "50%" }} />
                    <Typography variant="body1" color="text.secondary">Fully Paid ({formatCurrency(EXPECTED_BUS_FEE)})</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {withBus.filter((s) => s.busFee >= EXPECTED_BUS_FEE).length} students
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "warning.main", mr: 1, borderRadius: "50%" }} />
                    <Typography variant="body1" color="text.secondary">Partially Paid (&lt; {formatCurrency(EXPECTED_BUS_FEE)})</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {
                      withBus.filter(
                        (s) => s.busFee > 0 && s.busFee < EXPECTED_BUS_FEE
                      ).length
                    }{" "}
                    students
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "error.main", mr: 1, borderRadius: "50%" }} />
                    <Typography variant="body1" color="text.secondary">Not Paid (0)</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {withBus.filter((s) => s.busFee === 0).length} students
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Total Outstanding Bus Fee:</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="error.main"
                  >
                    {formatCurrency(busFeeAnalysis.difference)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">Potential Total Revenue (if 100% compliance):</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(busFeeAnalysis.expected)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Accordion Lists for Students */}
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, bgcolor: 'white', border: '1px solid #e0e0e0' }}>
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 3, color: 'text.primary', textAlign: 'center' }}
        >
          Detailed Student Lists
        </Typography>

        {/* Accordion for Students With Bus Service */}
        <Accordion
          sx={{
            mb: 2,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            '&.Mui-expanded': { margin: '8px 0', boxShadow: 6 },
            transition: 'all 0.3s ease-in-out',
          }}
          elevation={2}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              bgcolor: 'primary.dark',
              color: 'white',
              borderRadius: '2px 2px 0 0',
              '&.Mui-expanded': { borderRadius: '2px 2px 0 0' },
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)',
              },
              '& .MuiAccordionSummary-content': {
                ml: 1,
                alignItems: 'center',
              },
              py: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <DirectionsBus sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Students With Bus Service ({withBus.length})
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Filter students..."
                value={filterTextWithBus}
                onChange={(e) => setFilterTextWithBus(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
                    '&.Mui-focused fieldset': { borderColor: 'white', borderWidth: '2px' },
                  },
                  input: { color: 'white', py: '7.5px' },
                  '.MuiInputAdornment-root': { color: 'white' },
                  width: { xs: '100%', sm: 'auto' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'info.main',
                  '&:hover': { bgcolor: 'info.dark' },
                  color: 'white',
                  whiteSpace: 'nowrap',
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 },
                }}
                startIcon={<DownloadIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadWithBusPdf();
                }}
              >
                Download PDF
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  color: 'white',
                  whiteSpace: 'nowrap',
                  ml: { xs: 0, sm: 1 },
                  mt: { xs: 1, sm: 0 },
                }}
                startIcon={<PrintIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrintWithBusPdf();
                }}
              >
                Print
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {renderStudentTableContent(filteredWithBus, true)}
          </AccordionDetails>
        </Accordion>

        {/* Accordion for Students Without Bus Service */}
        <Accordion
          sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            '&.Mui-expanded': { margin: '8px 0', boxShadow: 6 },
            transition: 'all 0.3s ease-in-out',
          }}
          elevation={2}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={{
              bgcolor: 'secondary.dark',
              color: 'white',
              borderRadius: '2px 2px 0 0',
              '&.Mui-expanded': { borderRadius: '2px 2px 0 0' },
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)',
              },
              '& .MuiAccordionSummary-content': {
                ml: 1,
                alignItems: 'center',
              },
              py: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <School sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Students Without Bus Service ({withoutBus.length})
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Filter students..."
                value={filterTextWithoutBus}
                onChange={(e) => setFilterTextWithoutBus(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
                    '&.Mui-focused fieldset': { borderColor: 'white', borderWidth: '2px' },
                  },
                  input: { color: 'white', py: '7.5px' },
                  '.MuiInputAdornment-root': { color: 'white' },
                  width: { xs: '100%', sm: 'auto' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'info.main',
                  '&:hover': { bgcolor: 'info.dark' },
                  color: 'white',
                  whiteSpace: 'nowrap',
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 },
                }}
                startIcon={<DownloadIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadWithoutBusPdf();
                }}
              >
                Download PDF
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.dark' },
                  color: 'white',
                  whiteSpace: 'nowrap',
                  ml: { xs: 0, sm: 1 },
                  mt: { xs: 1, sm: 0 },
                }}
                startIcon={<PrintIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrintWithoutBusPdf();
                }}
              >
                Print
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {renderStudentTableContent(filteredWithoutBus, false)}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default StudentBusList;

