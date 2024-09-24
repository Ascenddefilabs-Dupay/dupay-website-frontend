/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import styles from './AuditLogs.module.css'; 
import { FaRegCalendar } from "react-icons/fa";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface WalletAdminActions {
  id: string;
  admins_actions_username: string;
  admins_actions: string;
  admins_actions_date: string;
  admins_actions_name: string;
  user_profile_photo: string;
}

const Dashboard = () => {
  const [actions, setActions] = useState<WalletAdminActions[]>([]);
  const [filteredActions, setFilteredActions] = useState<WalletAdminActions[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDateFields, setShowDateFields] = useState<boolean>(false);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/usermanagementapi/wallet-admin-actions/');
        setActions(response.data);
        setFilteredActions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchActions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  const openStartDatePicker = () => {
    const startDateInput = document.getElementById('start-date-input') as HTMLInputElement;
    startDateInput?.showPicker(); // Opens the Start Date picker
  };

  const openEndDatePicker = () => {
    const endDateInput = document.getElementById('end-date-input') as HTMLInputElement;
    endDateInput?.showPicker(); // Opens the End Date picker
  };
  const filterByDateRange = useCallback(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const filtered = actions.filter(action => {
      const actionDate = new Date(action.admins_actions_date);
      return (!start || actionDate >= start) && (!end || actionDate <= end);
    });
    setFilteredActions(filtered);
  }, [actions, startDate, endDate]);

  useEffect(() => {
    filterByDateRange();
  }, [filterByDateRange]);

  return (
    <div className={styles.page}>
             <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'630px', color: 'white'}} />
          </Link>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        
        <Typography variant="h4" className={styles.heading} gutterBottom style={{ flexGrow: 1 }}>
          Audit Logs
        </Typography>
        <IconButton
          onClick={() => setShowDateFields(!showDateFields)}
          className={styles.header}
        >
          <FaRegCalendar />
        </IconButton>
      </Box>
      {showDateFields && (
        <Box mb={2} display="flex" className={styles.box}>
          <Typography className={styles.head} sx={{ mr: 2 }}>
            From:
          </Typography>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            // sx={{ mr: 2, input: { color: 'white' ,backgroundColor:' rgba(128, 128, 128, 0.253)'} }} // White text color
            className={styles.dateField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                   onClick={openStartDatePicker}
                  >
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
        />
        </Box>
      )}

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>User</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Action</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Date and Time</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActions.map((action, index) => (
              <TableRow key={`${action.id}-${index}`} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  <Box display="flex" alignItems="center">
                    {action.user_profile_photo ? (
                      <img
                        src={action.user_profile_photo}
                        alt={action.admins_actions_username}
                        className={styles.profileImage}
                      />
                    ) : (
                      <Box className={styles.initialCircle}>
                        <Typography variant="body1" className={styles.initial}>
                          {action.admins_actions_username.charAt(0)}
                        </Typography>
                      </Box>
                    )}
                    <Box ml={2}>
                      <Typography variant="body1">{action.admins_actions_username}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>{action.admins_actions}</TableCell>
                <TableCell className={styles.tableCell}>{formatDate(action.admins_actions_date)}</TableCell>
                <TableCell className={styles.tableCell}>{action.admins_actions_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
