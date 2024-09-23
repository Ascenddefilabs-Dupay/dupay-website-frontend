/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
} from '@mui/material';
import axios from 'axios';
import styles from './TransactionHistory.module.css'; // Import the CSS module
import { SelectChangeEvent } from '@mui/material';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'; // Import additional icons
import { MdDateRange, MdOutlineAddCircle } from 'react-icons/md'; // Import icons
import { FaExchangeAlt } from 'react-icons/fa'; // Exchange icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'; //
// User and Transaction interfaces
interface Users {
  user_id: string;
  user_first_name: string;
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
  // Fetch users and transactions once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8000/usermanagementapi/profile/');
        const transactionsResponse = await axios.get('http://localhost:8000/usermanagementapi/transaction/');
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


  // Toggle the visibility of date filters
  const toggleDateFilters = () => {
    setShowDateFilters((prev) => !prev);
  };

  const toggleDate = () => {
    setShowDate((prev) => !prev);
  };
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value as string);
  };

  return (
    <div className={styles.page}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Transaction Monitoring
      </Typography>

      {/* Filter Buttons */}
      <Box className={styles.filterButtons}>
      <Button
          className={styles.filterButton}
          variant={selectedTransactionType === 'all' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('all')}
        >
          All
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedTransactionType === 'received' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('received')}
        >
          <AiOutlineArrowUp /> Received
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedTransactionType === 'Transfer' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('Transfer')}
        >
          <FaExchangeAlt /> Transfer
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedTransactionType === 'withdrawn' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('withdrawn')}
        >
          <AiOutlineArrowDown /> Withdraw
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedTransactionType === 'deposited' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('deposited')}
        >
          <MdOutlineAddCircle /> TopUp
        </Button>
        <Button>
        </Button>
        <Button>
        </Button>
        <Button
          variant="contained"
          onClick={toggleDate}
          className={styles.filter}
        >
          {showDate ? <FontAwesomeIcon icon={faMoneyBillWave} /> : <FontAwesomeIcon icon={faMoneyBillWave} />}
        </Button>
        {/* Toggle Button for Date Filters */}
        <Button
          variant="contained"
          onClick={toggleDateFilters}
          className={styles.filter}
        >
          {showDateFilters ? <MdDateRange /> : <MdDateRange />}
        </Button>
        
      </Box>
      
        {/* Main Container for Currency and Date Fields */}
        {(showDate || showDateFilters) && (
        <Box className={styles.mainFilters}>
            {showDate && (
            <Select
                value={selectedCurrency}
                onChange={handleFilterChange}
                displayEmpty
                className={styles.currencySelect}
                inputProps={{ 'aria-label': 'Currency' }}
            >
                <MenuItem value="">All Currencies</MenuItem>
                {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                    {currency}
                </MenuItem>
                ))}
            </Select>
            )}

            {showDateFilters && (
            <Box className={styles.dateFilters}>
                <TextField
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                className={styles.dateField}
                />
                <TextField
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                className={styles.dateField}
                />
            </Box>
            )}
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
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.map((data, index) => (
              <TableRow key={`${data.transaction_id}-${index}`} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={data.user_profile_photo}
                      alt={data.user_first_name}
                      className={styles.profileImage}
                    />
                    <Box ml={2}>
                      <Typography variant="body1">{data.user_first_name}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>{formatDate(data.transaction_timestamp)}</TableCell>
                <TableCell className={styles.tableCell}>{data.transaction_amount}</TableCell>
                <TableCell className={styles.tableCell}>{data.transaction_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
