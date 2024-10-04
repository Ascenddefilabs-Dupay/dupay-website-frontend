/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Select,
  MenuItem,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Menu
} from '@mui/material';
import { RiArrowDropDownLine } from 'react-icons/ri';
import axios from 'axios';
import styles from './TransactionHistory.module.css'; // Import the CSS module
import { SelectChangeEvent } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { FaRegCalendar } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
// User and Transaction interfaces
interface Users {
  user_id: string;
  user_first_name: string;
  user_middle_name:string;
  user_last_name:string;
  role: string;
  user_phone_number: string;
  user_email: string;
  status: string;
  user_type: string;
  user_profile_photo: string;
  last_login: string;
}

interface Transaction {
  user_phone_number: string;
  transaction_id: string;
  transaction_timestamp: string;
  transaction_amount: number;
  transaction_type: string;
  transaction_currency: string;
}

const Dashboard = () => {
  // State variables
  const [users, setUsers] = useState<Users[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [combinedData, setCombinedData] = useState<(Users & Transaction)[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDateFilters, setShowDateFilters] = useState<boolean>(false); // State to control date filter visibility
  const [showDate, setShowDate] = useState<boolean>(false);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  
  // Fetch users and transactions once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8000/transactionmonitoringapi/profile/');
        const transactionsResponse = await axios.get('http://localhost:8000/transactionmonitoringapi/transaction/');
        setUsers(usersResponse.data);
        setTransactions(transactionsResponse.data);
        // Extract unique currencies from transactions
        const uniqueCurrencies = Array.from(
            new Set((transactionsResponse.data as Transaction[]).map((transaction) => transaction.transaction_currency))
          );
          setCurrencies(uniqueCurrencies);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    fetchData();
    }, []);
    const openStartDatePicker = () => {
      const startDateInput = document.getElementById('start-date-input') as HTMLInputElement;
      startDateInput?.showPicker(); // Opens the Start Date picker
    };
  
    const openEndDatePicker = () => {
      const endDateInput = document.getElementById('end-date-input') as HTMLInputElement;
      endDateInput?.showPicker(); // Opens the End Date picker
    };
  // Format the transaction date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    // Extract year, month, and day
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
  
    // Format time
    const time = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  
    // Return formatted date and time as 'YYYY/M/D at hh:mm AM/PM'
    return `${year}/${month}/${day} at ${time}`;
  };

  // Filter and combine data whenever users, transactions, or selectedTransactionType changes
  useEffect(() => {
    const combineData = (users: Users[], transactions: Transaction[]) => {
      // Determine which transaction types to include
      const transactionTypesToInclude = selectedTransactionType === 'deposited'
        ? ['deposited', 'topup', 'topped_up'] // Include 'deposited', 'topup', and 'topped up' when 'deposited' is selected
        : [selectedTransactionType]; // Otherwise, use the selected type

      // Filter transactions by type
      const filteredTransactions = selectedTransactionType === 'all'
        ? transactions
        : transactions.filter((transaction) => {
            const transactionType = transaction.transaction_type?.toLowerCase();
            return transactionTypesToInclude.map(type => type.toLowerCase()).includes(transactionType);
          });

        // Filter transactions by currency
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const currencyFilteredTransactions =
        selectedCurrency === ''
            ? filteredTransactions
            : filteredTransactions.filter(
                (transaction) =>
                transaction.transaction_currency?.toLowerCase() === selectedCurrency.toLowerCase()
            );

        // Filter transactions by date range including start and end dates
        const dateFilteredTransactions = filteredTransactions.filter((transaction) => {
            const transactionDate = new Date(transaction.transaction_timestamp);
            
            // Create start and end date objects if startDate and endDate are provided
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            if (end) {
                end.setHours(23, 59, 59, 999); // Sets the time to the very last millisecond of the end date
            }
        
            // Include transactions that are within the specified range, including start and end dates
            return (
            (!start || transactionDate >= start) &&
            (!end || transactionDate <= end)
            );
        });
  
      // Combine user and transaction data
      const combined = users.flatMap((user) =>
        dateFilteredTransactions
          .filter(
            (transaction) =>
              transaction.user_phone_number === user.user_phone_number
          )
          .map((transaction) => ({ ...user, ...transaction }))
      );
      setCombinedData(combined);
    };
  
    combineData(users, transactions);
  }, [users, transactions, selectedTransactionType, selectedCurrency, startDate, endDate]);

  // Handle filter button click
  const handleFilter = (transaction_type: string) => {
    if (transaction_type === 'deposited') {
      setSelectedTransactionType('deposited'); // Set state to 'deposited'
    } else {
      setSelectedTransactionType(transaction_type); // Set state to other types
    }
  };

  const toggleDateFilters = () => {
    setShowDateFilters(!showDateFilters);
    setShowDate(false); // Disable date when filters are toggled
    setSelectedCurrency(''); // Clear currency selection
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const toggleDate = () => {
    setShowDate(!showDate);
    setShowDateFilters(false); // Disable date range when currency is selected
    setStartDate(''); // Clear start date
    setEndDate(''); // Clear end date
  };
  
  // Toggle the visibility of date filters
  // const toggleDateFilters = () => {
  //   setShowDateFilters((prev) => !prev);
  // };

  // const toggleDate = () => {
  //   setShowDate((prev) => !prev);
  // };
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value as string);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.page}>
      {showLoader && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
                <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'630px', color: 'white'}} />
          </Link>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Transaction Monitoring
      </Typography>
        <IconButton
        title='Filter'
          onClick={handleClick}
          className={styles.header}
        >
          <IoFilter />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{
            style: {
              backgroundColor: '#2A2D3C',
            },
          }}>
          <MenuItem onClick={() => { handleFilter('all'); handleClose(); }} sx={{ color: 'white' }}>All Transactions</MenuItem>
          <MenuItem onClick={() => { handleFilter('deposited'); handleClose(); }} sx={{ color: 'white' }}>Top-up</MenuItem>
          <MenuItem onClick={() => { handleFilter('withdrawn'); handleClose(); }} sx={{ color: 'white' }}>Withdrawal</MenuItem>
          <MenuItem onClick={() => { handleFilter('Transfer'); handleClose(); }} sx={{ color: 'white' }}>Transfers</MenuItem>
          <MenuItem onClick={() => { handleFilter('received'); handleClose(); }} sx={{ color: 'white' }}>Received Payments</MenuItem>
          <MenuItem onClick={() => { toggleDateFilters(); handleClose(); }} sx={{ color: 'white' }}>Date Range</MenuItem>
          <MenuItem onClick={() => { toggleDate(); handleClose(); }} sx={{ color: 'white' }}>Currency Type</MenuItem>
        </Menu>
        </Box>
        {/* Main Container for Currency and Date Fields */}
        <Box className={styles.mainFilters}>
          {showDate && (
            <Select
              value={selectedCurrency}
              onChange={handleFilterChange}
              displayEmpty
              className={styles.currencySelect}
              inputProps={{ 'aria-label': 'Currency' }}
              disabled={showDateFilters} // Disable currency select when date filters are shown
              IconComponent={() => (
                <RiArrowDropDownLine style={{ color: 'white', fontSize: '60px' }} />
              )}
            >
              <MenuItem value="">All Currencies</MenuItem>
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        {showDateFilters && (
          <Box mb={2} display="flex" className={styles.box}>
            <Typography className={styles.head} sx={{ mr: 2 }}>
              From:
            </Typography>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={styles.dateField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={openStartDatePicker}>
                      <FaRegCalendar style={{ color: 'white', fontSize: '16px' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              id="start-date-input"
              sx={{
                input: {
                  color: 'white',
                  backgroundColor: 'rgba(128, 128, 128, 0.253)',
                },
              }}
              disabled={showDate} // Disable start date when currency is selected
            />
            <Typography className={styles.head} sx={{ mr: 2 }}>
              To:
            </Typography>
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={styles.dateField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={openEndDatePicker}>
                      <FaRegCalendar style={{ color: 'white', fontSize: '16px' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              id="end-date-input"
              sx={{
                input: {
                  color: 'white',
                  backgroundColor: 'rgba(128, 128, 128, 0.253)',
                },
              }}
              disabled={showDate} // Disable end date when currency is selected
            />
          </Box>
        )}

      {/* Combined Table */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Name</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Date</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Amount</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Transaction Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.map((data, index) => (
              <TableRow key={`${data.transaction_id}-${index}`} className={styles.tableRow}>
                <TableCell className={styles.tableCell} style={{ width: '150px', maxWidth: '150px' }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    {data.user_profile_photo ? (
                      <img
                        src={data.user_profile_photo}
                        alt={data.user_first_name}
                        className={styles.profileImage}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                    ) : (
                      <Box className={styles.profilePlaceholder} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" className={styles.initial}>
                          {`${data.user_first_name} ${data.user_middle_name || ''} ${data.user_last_name || ''}`.trim().charAt(0)}
                        </Typography>
                      </Box>
                    )}
                    <Box display="flex" alignItems="center" justifyContent="center" ml={2}>
                      <Typography variant="body1" justifyContent="center" alignItems="center">
                      {`${data.user_first_name} ${data.user_middle_name || ''} ${data.user_last_name || ''}`.trim()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell} style={{ width: '200px' }}>
                  {formatDate(data.transaction_timestamp)}
                </TableCell>
                <TableCell className={styles.tableCell} style={{ width: '150px' }}>
                  {data.transaction_amount}
                </TableCell>
                <TableCell className={styles.tableCell} style={{ width: '150px' }}>
                  {data.transaction_type}
                </TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
