import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import { fetchUnpaidFamilies } from "../../pages/Payment/unpaidFamilySlice";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { Print, PictureAsPdf, Description } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ----------------------------- types ------------------------------ */
interface UnpaidFamily {
  familyName: string;
  phones?: string[];
  totalBalance: number;
}

/* ----------------------------- helpers ---------------------------- */
const currency = (n: number | null | undefined): string =>
  typeof n === "number" && !isNaN(n) ? `$${n.toFixed(2)}` : "$0.00";

const joinPhones = (arr?: string[]): string => {
  if (!arr || !arr.length) return "N/A";
  const uniqueNumbers = Array.from(new Set(arr.filter(Boolean)));
  return uniqueNumbers.join(", ");
};

/** Build one professional PDF (table) and return the doc */
const generateReport = (families: UnpaidFamily[]): jsPDF => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Unpaid Family Summary Report", 14, 16);

  const rows = families.map((f, i) => [
    i + 1,
    f.familyName,
    joinPhones(f.phones),
    currency(f.totalBalance),
  ]);

  autoTable(doc, {
    startY: 22,
    head: [["#", "Family", "Phones", "Balance"]],
    body: rows,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2, overflow: "linebreak" as const },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
      3: { cellWidth: 30, halign: "right" as const },
    },
  } as any);

  return doc;
};

/* ----------------------------- component -------------------------- */
const UnpaidFamilySummary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { families = [], loading, error } = useSelector((state: RootState) => {
    const s = (state as any).unpaidFamily as
      | { families?: UnpaidFamily[]; loading?: boolean; error?: string }
      | undefined;
    return {
      families: s?.families ?? [],
      loading: s?.loading ?? false,
      error: s?.error ?? "",
    };
  });

  useEffect(() => {
    dispatch(fetchUnpaidFamilies());
  }, [dispatch]);

  /* ------------------------------- handlers ------------------------ */
  const handlePrint = () => {
    const doc = generateReport(families);
    doc.autoPrint();
    doc.output("dataurlnewwindow");
  };

  const handlePdfDownload = () => {
    const doc = generateReport(families);
    doc.save("Unpaid_Family_Summary.pdf");
  };

  const handleExcelDownload = () => {
    let csv = "No,Family,Phones,Balance\n";
    families.forEach((f, i) => {
      csv += `${i + 1},"${f.familyName}","${joinPhones(f.phones)}",${Number(
        f.totalBalance || 0
      ).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "Unpaid_Family_Summary.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* --------------------------------- UI ---------------------------- */
  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Unpaid Family Summary
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ mr: 1, textTransform: "none" }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdf />}
              onClick={handlePdfDownload}
              sx={{ mr: 1, textTransform: "none" }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Description />}
              onClick={handleExcelDownload}
              sx={{ textTransform: "none" }}
            >
              Download Excel
            </Button>
          </Box>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Family</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phones</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(families as UnpaidFamily[]).map((f, i) => (
                <TableRow key={f.familyName + i} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{f.familyName}</TableCell>
                  <TableCell>{joinPhones(f.phones)}</TableCell>
                  <TableCell align="right">{currency(f.totalBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default UnpaidFamilySummary;
