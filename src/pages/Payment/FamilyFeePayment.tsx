import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Divider
} from '@mui/material';
import { Print as PrintIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const FamilyFeePayment = () => {
  const [shift, setShift] = useState('Morning');
  const [paymentType, setPaymentType] = useState('No');
  const [remarks, setRemarks] = useState('');
  
  // Mock student data
  const students = [
    { id: 'S001', name: 'Ahmed Mohamed', grade: 'Grade 10', fee: '$150' },
    { id: 'S002', name: 'Fatima Hassan', grade: 'Grade 9', fee: '$140' },
    { id: 'S003', name: 'Omar Ali', grade: 'Grade 11', fee: '$160' },
    { id: 'S004', name: 'Aisha Abdi', grade: 'Grade 8', fee: '$130' },
  ];

  return (
    <Box sx={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: 3,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold', 
        marginBottom: 3,
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        Family Fee Payment
      </Typography>

      {/* Search Section */}
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 3, backgroundColor: '#ffffff' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField 
              label="Search" 
              variant="outlined" 
              fullWidth 
              size="small"
              placeholder="Search by student ID or name"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Shift</InputLabel>
              <Select
                value={shift}
                label="Shift"
                onChange={(e) => setShift(e.target.value)}
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Afternoon">Afternoon</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" fullWidth>Search</Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Student Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Student's Full Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{student.fee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Payment Section */}
      <Grid container spacing={3}>
        {/* Left Column - Payment Details */}
        <Grid item xs={8}>
          <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Fee Payment Appointment
            </Typography>
            
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
              <strong>Date:</strong> 03 Jun 2025
            </Typography>
            
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                backgroundColor: '#2e7d32',
                color: 'white',
                fontWeight: 'bold',
                padding: '8px 16px',
                marginBottom: 3
              }}
            >
              Wakliga Lacag Bixinta
            </Button>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Edit
            </Typography>
            
            <TextField 
              label="Total Amount" 
              variant="outlined" 
              fullWidth 
              size="small"
              value="$500"
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ fontWeight: 'bold' }}>$</Typography>,
              }}
            />
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Number No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>S</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>6053454</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Print RV</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell><CheckIcon color="success" /></TableCell>
                    <TableCell>S001</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small">
                        <PrintIcon fontSize="small" /> Print
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value="June"
                    label="Month"
                  >
                    <MenuItem value="June">June</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="August">August</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth>
                  Check ID
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value="2025"
                    label="Year"
                  >
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
                  Pay
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Paym. Type</InputLabel>
                  <Select
                    value={paymentType}
                    label="Paym. Type"
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth>
                  Balance
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <TextField 
                  label="Paym. Date" 
                  variant="outlined" 
                  fullWidth 
                  size="small"
                  value="03 Jun 2025"
                />
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth>
                  Excel
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Remarks" 
                  variant="outlined" 
                  fullWidth 
                  size="small"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ marginTop: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ backgroundColor: '#d32f2f' }}
                  startIcon={<CloseIcon />}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Date Range Section */}
          <Paper elevation={2} sx={{ padding: 2, marginTop: 3, backgroundColor: '#ffffff' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  From
                </Typography>
                <Typography>03 Jun 2025</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  To
                </Typography>
                <Typography>03 Jun 2025</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Right Column - Payment History and Balance */}
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                backgroundColor: '#1976d2',
                fontWeight: 'bold',
                marginBottom: 2
              }}
              startIcon={<PrintIcon />}
            >
              Print Payment History
            </Button>
            
            <Box sx={{ backgroundColor: '#e9ecef', padding: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                ID NO
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>6053454</Typography>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Students Full Name
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>Ahmed Mohamed</Typography>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Month Name
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>June</Typography>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Balance
              </Typography>
              <Typography>$0</Typography>
            </Box>
          </Paper>
          
          {/* Balance Summary */}
          <Paper elevation={2} sx={{ padding: 2, marginTop: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
              Balance Summary
            </Typography>
            
            <Grid container spacing={1} sx={{ marginBottom: 1 }}>
              <Grid item xs={8}>
                <Typography>Current Balance:</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>$0</Typography>
              </Grid>
            </Grid>
            
            <Grid container spacing={1} sx={{ marginBottom: 1 }}>
              <Grid item xs={8}>
                <Typography>Previous Balance:</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography>$0</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 1 }} />
            
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total Balance:
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  $0
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FamilyFeePayment;