import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  Button,
  Grid,
  Collapse,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchCashLedger, createCashLedgerEntry } from "./profitLogSlice";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const CashLedgerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { ledger, loading, error } = useAppSelector((state) => state.profitLog);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "DEPOSIT",
    source: "Manual",
    amount: "",
    method: "Cash",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchCashLedger());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    try {
      await dispatch(createCashLedgerEntry(payload)).unwrap();
      toast.success("Ledger entry created");
      setFormData({
        type: "DEPOSIT",
        source: "Manual",
        amount: "",
        method: "Cash",
        description: "",
      });
      setShowForm(false);
      dispatch(fetchCashLedger());
    } catch (err) {
      toast.error("Failed to create ledger entry");
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">🧾 Cash Ledger Entries</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Register Ledger Entry"}
          </Button>
        </Box>

        <Collapse in={showForm}>
          <Paper variant="outlined" sx={{ p: 2, mb: 4, backgroundColor: "#f9f9f9" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Type"
                    name="type"
                    select
                    fullWidth
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                    <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Source"
                    name="source"
                    fullWidth
                    value={formData.source}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    fullWidth
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Method"
                    name="method"
                    select
                    fullWidth
                    value={formData.method}
                    onChange={handleChange}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bank">Bank</MenuItem>
                    <MenuItem value="Mobile">Mobile</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="success">
                    Submit Entry
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Collapse>

        {loading ? (
          <Box textAlign="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : ledger.length === 0 ? (
          <Typography>No ledger entries available.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Balance After</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.date), "yyyy-MM-dd")}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.type}
                      color={entry.type === "DEPOSIT" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{entry.source}</TableCell>
                  <TableCell>{entry.amount.toFixed(2)}</TableCell>
                  <TableCell>{entry.method}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.balanceAfter.toFixed(2)}</TableCell>
                  <TableCell>{entry.createdBy?.fullName || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default CashLedgerList;
