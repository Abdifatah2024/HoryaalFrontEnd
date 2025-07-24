import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  setDiscountLimit,
  getDiscountLimit,
  updateDiscountLimit,
  clearDiscountLimitState,
} from "../../Redux/Payment/discountLimitSlice";
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
} from "@mui/material";

const DiscountLimitManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLimit, loading, error, successMessage } = useSelector(
    (state: RootState) => state.discountLimit
  );

  const [formOpen, setFormOpen] = useState(false);
  const [month, setMonth] = useState<number>(7);
  const [year, setYear] = useState<number>(2025);
  const [maxLimit, setMaxLimit] = useState<number>(300);

  const handleSubmit = () => {
    dispatch(setDiscountLimit({ month, year, maxLimit }));
  };

  const handleGet = () => {
    dispatch(getDiscountLimit({ month, year }));
  };

  const handleUpdate = () => {
    dispatch(updateDiscountLimit({ month, year, maxLimit }));
  };

  useEffect(() => {
    dispatch(clearDiscountLimitState());
  }, [dispatch]);

  return (
    <Paper elevation={3} className="p-6 max-w-2xl mx-auto mt-6">
      <Typography variant="h5" gutterBottom>
        Monthly Discount Limit
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setFormOpen(!formOpen)}
        style={{ marginBottom: "1rem" }}
      >
        {formOpen ? "Hide Form" : "Register New Limit"}
      </Button>

      {formOpen && (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Month"
              type="number"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Max Limit"
              type="number"
              value={maxLimit}
              onChange={(e) => setMaxLimit(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={loading}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={handleGet}
              disabled={loading}
              style={{ marginLeft: 10 }}
            >
              Load
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
              disabled={loading}
              style={{ marginLeft: 10 }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      )}

      {error && <Typography color="error">{error}</Typography>}
      {successMessage && <Typography color="primary">{successMessage}</Typography>}

      {currentLimit && (
        <Paper elevation={1} className="p-4 mt-4">
          <Typography variant="h6">Current Limit</Typography>
          <Typography>Month: {currentLimit.month}</Typography>
          <Typography>Year: {currentLimit.year}</Typography>
          <Typography>Limit: ${currentLimit.maxLimit}</Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default DiscountLimitManager;
