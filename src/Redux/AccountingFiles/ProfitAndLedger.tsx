import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store"; // adjust if needed

import {
  fetchProfitLogs,
  autoCreateProfitLog,
  autoUpdateProfitLog,
} from "./profitLogSlice";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";



const ProfitLogManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const closedById = useSelector(
  (state: RootState) => state.loginSlice.data?.user?.id
);

  const { logs: profitLogs, loading, error } = useAppSelector(
    (state) => state.profitLog
  );

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProfitLogs());
  }, [dispatch]);

const handleAutoCreate = async () => {
  if (!closedById) {
    toast.error("User ID not available");
    return;
  }

  const res = await dispatch(autoCreateProfitLog({ month, year, closedById }));
  if (autoCreateProfitLog.fulfilled.match(res)) {
    toast.success("ProfitLog created successfully");
    dispatch(fetchProfitLogs());
  } else {
    toast.error(res.payload as string);
  }
};


  const handleAutoUpdate = async () => {
    const res = await dispatch(autoUpdateProfitLog({ month, year, notes }));
    if (autoUpdateProfitLog.fulfilled.match(res)) {
      toast.success("ProfitLog updated successfully");
      dispatch(fetchProfitLogs());
    } else {
      toast.error(res.payload as string);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          💼 Monthly Profit Log Manager
        </Typography>

        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={12} sm={4} md={2.5}>
            <TextField
              fullWidth
              type="number"
              label="Month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              inputProps={{ min: 1, max: 12 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.5}>
            <TextField
              fullWidth
              type="number"
              label="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              fullWidth
              label="Update Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAutoCreate}
              disabled={loading}
            >
              {loading ? "..." : "🚀 Create"}
            </Button>
          </Grid>
          <Grid item xs={6} md={1.5}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleAutoUpdate}
              disabled={loading}
            >
              {loading ? "..." : "🛠️ Update"}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              📊 All Profit Logs
            </Typography>
            {profitLogs?.length === 0 ? (
              <Typography>No profit logs available.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 2 }}>
                {profitLogs?.map((log) => (
                  <li key={log.id}>
                    <strong>{`Month: ${log.month}/${log.year}`}</strong> — Net Income:{" "}
                    <strong style={{ color: log.netIncome >= 0 ? "green" : "red" }}>
                      {log.netIncome}
                    </strong>
                    {log.notes && <em> — Notes: {log.notes}</em>}
                  </li>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ProfitLogManager;
