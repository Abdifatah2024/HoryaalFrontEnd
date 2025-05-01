import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClasses } from '../../Redux/Auth/ClassStudentListSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import { ClassItem, Student } from '../../types/ClassListTypes';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, CircularProgress, Alert, Chip, Avatar, AvatarGroup,
  Card, CardContent, CardHeader, Divider, TextField, InputAdornment,
  MenuItem, Select, FormControl, InputLabel, Grid, IconButton, Tooltip,
  Collapse, Button, useMediaQuery, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon, FilterList as FilterListIcon, Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  '&.paid': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark
  },
  '&.unpaid': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark
  },
  '&.partial': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark
  }
}));

type PaymentStatus = 'paid' | 'unpaid' | 'partial';

const ClassLists: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  const dispatch = useDispatch<AppDispatch>();
  const { classes, status, error } = useSelector((state: RootState) => state.class);

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [expandedClass, setExpandedClass] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClasses());
    }
  }, [status, dispatch]);

  const getPaymentStatus = useCallback((fee: number, amount: number): PaymentStatus => {
    if (amount >= fee) return 'paid';
    if (amount <= 0) return 'unpaid';
    return 'partial';
  }, []);

  const getStatusLabel = useCallback((status: PaymentStatus): string => {
    const statusLabels: Record<PaymentStatus, string> = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      partial: 'Partial'
    };
    return statusLabels[status] || status;
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((classItem) => {
      if (selectedClass !== 'all' && classItem.id !== parseInt(selectedClass)) {
        return false;
      }

      const hasMatchingClass = classItem.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingStudent = classItem.Student.some(student => 
        student.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (searchTerm && !hasMatchingClass && !hasMatchingStudent) {
        return false;
      }

      if (paymentFilter !== 'all') {
        const hasMatchingPaymentStatus = classItem.Student.some(student => {
          const status = getPaymentStatus(student.fee, student.Amount);
          return paymentFilter === status;
        });
        
        if (!hasMatchingPaymentStatus) {
          return false;
        }
      }

      return true;
    });
  }, [classes, selectedClass, searchTerm, paymentFilter, getPaymentStatus]);

  const handleClearFilters = useCallback(() => {
    setSelectedClass('all');
    setSearchTerm('');
    setPaymentFilter('all');
    setExpandedClass(null);
  }, []);

  const toggleClassExpansion = useCallback((classId: number) => {
    setExpandedClass(prev => prev === classId ? null : classId);
  }, []);

  const renderMobileStudentRow = (student: Student) => {
    const status = getPaymentStatus(student.fee, student.Amount);
    
    return (
      <Box key={student.id} sx={{ 
        mb: 2, 
        p: 2, 
        border: `1px solid ${theme.palette.divider}`, 
        borderRadius: 1 
      }}>
        <Typography variant="subtitle1" fontWeight="bold">{student.fullname}</Typography>
        <Typography variant="body2" color="text.secondary">{student.gender}, Age: {student.Age}</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Box>
            <Typography variant="body2">Fee: ${student.fee.toFixed(2)}</Typography>
            <Typography variant="body2">Paid: ${student.Amount?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <StatusChip 
            label={getStatusLabel(status)} 
            className={status} 
            size="small" 
          />
        </Box>
      </Box>
    );
  };

  const renderDesktopStudentRow = (student: Student) => {
    const status = getPaymentStatus(student.fee, student.Amount);
    
    return (
      <TableRow key={student.id} hover>
        <TableCell sx={{ minWidth: 150 }}>{student.fullname}</TableCell>
        <TableCell sx={{ minWidth: 80 }}>{student.gender}</TableCell>
        {!isTablet && (
          <>
            <TableCell sx={{ minWidth: 120 }}>{student.phone}</TableCell>
            <TableCell sx={{ minWidth: 120 }}>{student.phone2 || '-'}</TableCell>
          </>
        )}
        <TableCell sx={{ minWidth: 80 }}>{student.bus || '-'}</TableCell>
        {!isTablet && <TableCell sx={{ minWidth: 150 }}>{student.address || '-'}</TableCell>}
        <TableCell sx={{ minWidth: 120 }}>{student.motherName || '-'}</TableCell>
        {!isTablet && <TableCell sx={{ minWidth: 150 }}>{student.previousSchool || '-'}</TableCell>}
        <TableCell sx={{ minWidth: 60 }}>{student.Age}</TableCell>
        <TableCell sx={{ minWidth: 80 }} align="right">${student.fee.toFixed(2)}</TableCell>
        <TableCell sx={{ minWidth: 80 }} align="right">${student.Amount?.toFixed(2) || '0.00'}</TableCell>
        <TableCell sx={{ minWidth: 100 }} align="center">
          <StatusChip 
            label={getStatusLabel(status)} 
            className={status} 
            size="small" 
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>Student</TableCell>
        <TableCell>Gender</TableCell>
        {!isTablet && (
          <>
            <TableCell>Phone 1</TableCell>
            <TableCell>Phone 2</TableCell>
          </>
        )}
        <TableCell>Bus</TableCell>
        {!isTablet && <TableCell>Address</TableCell>}
        <TableCell>Mother</TableCell>
        {!isTablet && <TableCell>Prev School</TableCell>}
        <TableCell>Age</TableCell>
        <TableCell align="right">Fee</TableCell>
        <TableCell align="right">Paid</TableCell>
        <TableCell align="center">Status</TableCell>
      </TableRow>
    </TableHead>
  );

  const renderLoadingState = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress size={60} />
    </Box>
  );

  const renderErrorState = () => (
    <Alert severity="error" sx={{ mb: 3 }}>
      Error loading classes: {error}
    </Alert>
  );

  const renderEmptyState = () => (
    <Box textAlign="center" py={4}>
      <Typography variant="h6" color="textSecondary">
        No classes match your filters
      </Typography>
    </Box>
  );

  const renderClassCards = () => (
    filteredClasses.map((classItem: ClassItem) => (
      <StyledCard key={classItem.id}>
        <CardHeader 
          title={(
            <Box display="flex" alignItems="center">
              <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                {classItem.name}
              </Typography>
              <IconButton onClick={() => toggleClassExpansion(classItem.id)}>
                {expandedClass === classItem.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          )}
          subheader={(
            <Box display="flex" alignItems="center" mt={1}>
              <Chip 
                label={`${classItem.Student.length} student${classItem.Student.length !== 1 ? 's' : ''}`} 
                variant="outlined" 
                size="small" 
              />
              <Box ml={2}>
                <AvatarGroup max={5}>
                  {classItem.Student.map(student => (
                    <Tooltip key={student.id} title={student.fullname}>
                      <Avatar>{student.fullname.charAt(0)}</Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>
            </Box>
          )}
        />
        <Divider />

        <Collapse in={expandedClass === classItem.id}>
          <CardContent sx={{ p: isMobile ? 1 : 2 }}>
            {isMobile ? (
              <Box>
                {classItem.Student.map(renderMobileStudentRow)}
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table 
                  size={isTablet ? 'small' : 'medium'}
                  sx={{ tableLayout: 'fixed' }}
                >
                  {renderTableHeader()}
                  <TableBody>
                    {classItem.Student.map(renderDesktopStudentRow)}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Collapse>
      </StyledCard>
    ))
  );

  if (status === 'loading') return renderLoadingState();
  if (status === 'failed') return renderErrorState();

  return (
    <Box sx={{ 
      py: 3, 
      px: isMobile ? 1 : 3,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 600, 
        mb: 4,
        fontSize: isMobile ? '1.5rem' : '2rem'
      }}>
        Class Management
      </Typography>

      <Card sx={{ 
        mb: 3, 
        p: isMobile ? 1 : 2,
        width: '100%'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField 
              fullWidth 
              size={isMobile ? 'small' : 'medium'}
              variant="outlined" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>Class</InputLabel>
              <Select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)} 
                label="Class"
              >
                <MenuItem value="all">All Classes</MenuItem>
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Tooltip title="Toggle filters">
              <Button 
                startIcon={<FilterListIcon />} 
                endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                onClick={() => setShowFilters(!showFilters)} 
                color={showFilters ? 'primary' : 'inherit'} 
                variant="outlined" 
                fullWidth
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? 'Filters' : 'Toggle Filters'}
              </Button>
            </Tooltip>
          </Grid>

          {showFilters && (
            <Grid item xs={12}>
              <Collapse in={showFilters}>
                <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                  <InputLabel>Payment Status</InputLabel>
                  <Select 
                    value={paymentFilter} 
                    onChange={(e) => setPaymentFilter(e.target.value)} 
                    label="Payment Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                  </Select>
                </FormControl>
              </Collapse>
            </Grid>
          )}

          {(selectedClass !== 'all' || searchTerm || paymentFilter !== 'all') && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button 
                  onClick={handleClearFilters} 
                  color="error" 
                  startIcon={<ClearIcon />} 
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>

      {filteredClasses.length === 0 ? renderEmptyState() : renderClassCards()}
    </Box>
  );
};

export default ClassLists;
