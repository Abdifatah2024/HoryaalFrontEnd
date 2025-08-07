import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchUnpaidFamilies } from "../../pages/Payment/unpaidFamilySlice";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import { Print, PictureAsPdf, Description } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const UnpaidFamilyReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { families = [], loading, error } = useSelector(
    (state: RootState) => state.unpaidFamily || {}
  );

  useEffect(() => {
    dispatch(fetchUnpaidFamilies());
  }, [dispatch]);

  const generatePdfReport = (doc: jsPDF) => {
    doc.setFontSize(18);
    doc.text("Unpaid Family Report", 14, 20);

    let yOffset = 30;
    families.forEach((family, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Family: ${family.familyName} | Phones: ${
          family.phones?.join(", ") || "N/A"
        }`,
        14,
        yOffset
      );
      yOffset += 6;

      const rows: any[] = [];
      family.students?.forEach((std: any) => {
        std.unpaidFees?.forEach((fee: any) => {
          rows.push([
            std.id,
            std.fullname,
            std.className,
            `${fee.month}-${fee.year}`,
            `$${Number(fee.student_fee).toFixed(2)}`,
          ]);
        });
      });

      autoTable(doc, {
        startY: yOffset,
        head: [["ID", "Student", "Class", "Month", "Amount"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
        didDrawPage: (data) => {
          if (data?.cursor) yOffset = data.cursor.y + 10;

        },
      });

      doc.text(
        `Family Total Balance: $${family.totalBalance.toFixed(2)}`,
        14,
        yOffset
      );
      yOffset += 10;
    });
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    generatePdfReport(doc);
    doc.autoPrint();
    doc.output("dataurlnewwindow");
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    generatePdfReport(doc);
    doc.save("Unpaid_Family_Report.pdf");
  };

  const handleExcelDownload = () => {
    let csvContent = "Family Name,Phone,Student ID,Student Name,Class,Month,Amount\n";
    families.forEach((family) => {
      family.students?.forEach((student: any) => {
        student.unpaidFees?.forEach((fee: any) => {
          csvContent += `${family.familyName},"${
            family.phones?.join(", ") || "N/A"
          }",${student.id},"${student.fullname}","${student.className}","${fee.month}-${fee.year}",${Number(
            fee.student_fee
          ).toFixed(2)}\n`;
        });
      });
    });
    downloadCSV(csvContent, "Unpaid_Family_Report.csv");
  };

  return (
    <Box p={3}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Unpaid Family Report</Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={handlePdfDownload}
            sx={{ mr: 1 }}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Description />}
            onClick={handleExcelDownload}
          >
            Download Excel
          </Button>
        </Box>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          {families.map((family, index) => (
            <Box key={index} mb={4}>
              <Typography variant="h6">
                {index + 1}. Family: {family.familyName}
              </Typography>
              <Typography variant="body2" mb={1}>
                Phones: {family.phones?.join(", ") || "N/A"}
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {family.students?.flatMap((std: any) =>
                    std.unpaidFees?.map((fee: any, i: number) => (
                      <TableRow key={`${std.id}-${i}`}>
                        <TableCell>{std.id}</TableCell>
                        <TableCell>{std.fullname}</TableCell>
                        <TableCell>{std.className}</TableCell>
                        <TableCell>
                          {fee.month}-{fee.year}
                        </TableCell>
                        <TableCell>
                          ${Number(fee.student_fee).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )) || []
                  )}
                </TableBody>
              </Table>

              <Typography variant="subtitle1" mt={1}>
                Family Total Balance: ${family.totalBalance.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default UnpaidFamilyReport;
