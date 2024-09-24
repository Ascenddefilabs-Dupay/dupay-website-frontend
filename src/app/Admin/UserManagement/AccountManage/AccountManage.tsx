/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import axios, { AxiosError } from 'axios';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './AccountManage.module.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Users {
  user_id: string;
  user_first_name: string;
  user_middle_name: string;
  user_last_name: string;
  role: string;
  user_phone_number: string;
  user_email: string;
  user_status: boolean;
  user_hold: boolean;
  user_type: string;
  user_profile_photo: string;
  last_login: string;
}

interface ErrorResponse {
  error?: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  // const [openDetails, setOpenDetails] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/usermanagementapi/profile/')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    let filtered = users;
  
    if (selectedUserType !== 'all') {
      filtered = filtered.filter(user => user.user_type === selectedUserType);
    }
  
    if (selectedStatus === 'Active') {
      filtered = filtered.filter(user => user.user_status === true && !user.user_hold); // Active users, not on hold
    } else if (selectedStatus === 'Inactive') {
      filtered = filtered.filter(user => user.user_status === false && !user.user_hold); // Inactive users, not on hold
    } else if (selectedStatus === 'Hold') {
      filtered = filtered.filter(user => user.user_hold === true); // Only users on hold
    }
  
    setFilteredUsers(filtered);
  }, [users, selectedUserType, selectedStatus]);

  const handleFilter = (user_type: string) => {
    setSelectedUserType(user_type);
  };

  // const handleMoreVertClick = (userId: number) => {
  //   setOpenDetails(openDetails === userId ? null : userId);
  // };

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/usermanagementapi/profile/${userId}/`);

      if (response.status === 204 || response.status === 200) {
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        setFilteredUsers(prevFilteredUsers => prevFilteredUsers.filter(user => user.user_id !== userId));
      } else {
        console.error('Unexpected response status:', response.status);
        alert('Unexpected response from the server.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const errorData = axiosError.response.data as ErrorResponse;

        if (errorData.error && errorData.error.includes('related records in currency_converter_fiatwallet')) {
          alert('Cannot delete user because there are related records in the system.');
        } else if (axiosError.response.status === 400) {
          alert('Bad request. Please check the input and try again.');
        } else {
          console.error('Server error:', errorData);
          alert('An error occurred while trying to delete the user. Please try again.');
        }
      } else {
        console.error('Network error or unknown issue:', axiosError.message);
        alert('A network error occurred. Please check your connection and try again.');
      }
    }
  };

  const getStatusDisplay = (user_hold?: boolean, user_status?: string | boolean) => {
    if (user_hold === true) {
      return { text: 'Hold', color: 'orange' };
    }

    if (user_status === 'true' || user_status === true) {
      return { text: 'Active', color: 'green' };
    } else if (user_status === 'false' || user_status === false) {
      return { text: 'Inactive', color: 'red' };
    }

    return { text: 'Inactive', color: 'red' };
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
          <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'500px', color: 'white'}} />
          </Link>
            <center>
              <div className="centeredBox">
              <Typography variant="h4" className={styles.heading} gutterBottom>
                Account Management
              </Typography>
              </div>
            </center>
          </header>
      <Grid container spacing={2} className={styles.statisticsContainer}>
        <Grid item xs={4}>
          <Paper className={styles.statisticBox}>
            <Typography variant="h6">Customers</Typography>
            <Typography variant="h4">{users.filter(user => user.user_type === 'customer').length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={styles.statisticBox}>
            <Typography variant="h6">Admins</Typography>
            <Typography variant="h4">{users.filter(user => user.user_type === 'admin').length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={styles.statisticBox}>
            <Typography variant="h6">Super Admins</Typography>
            <Typography variant="h4">{users.filter(user => user.user_type === 'super_admin').length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box className={styles.filterButtons}>
        <Button
          className={styles.filterButton}
          variant={selectedUserType === 'all' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('all')}
        >
          View All
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedUserType === 'customer' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('customer')}
        >
          Customer
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedUserType === 'admin' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('admin')}
        >
          Admin
        </Button>
        <Button
          className={styles.filterButton}
          variant={selectedUserType === 'super_admin' ? 'contained' : 'outlined'}
          onClick={() => handleFilter('super_admin')}
        >
          Super Admin
        </Button>
        <Button href="/Admin/UserManagement/AddUser" className={styles.button}>
          + Add Users
        </Button>
        <Button>
        <FormControl className={styles.filterDropdown} style={{ width: '150px', height: '40px' }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as string)}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #007bff9f, #800080)',
              color: 'white',
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  background: 'linear-gradient(90deg, #007bff9f, #800080)',
                },
              },
            }}
          >
            <MenuItem value="all" style={{ color: 'white' }}>All</MenuItem>
            <MenuItem value="Active" style={{ color: 'white' }}>Active</MenuItem>
            <MenuItem value="Inactive" style={{ color: 'white' }}>Inactive</MenuItem>
            <MenuItem value="Hold" style={{ color: 'white' }}>Hold</MenuItem>
          </Select>
        </FormControl>
        </Button>
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Username</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Role</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Phone</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Status</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Action</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>User Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => {
              const { text: statusText, color: statusColor } = getStatusDisplay(user.user_hold, user.user_status);
              return (
                <TableRow key={user.user_id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <Box display="flex" alignItems="center">
                    {user.user_profile_photo ? (
                        <img
                          src={user.user_profile_photo}
                          alt={user.user_first_name}
                          className={styles.profileImage}
                        />
                      ) : (
                        <Box className={styles.profilePlaceholder}>
                          <Typography variant="h4" className={styles.initial}>
                            {`${user.user_first_name} ${user.user_middle_name || ''} ${user.user_last_name || ''}`.trim().charAt(0)}
                          </Typography>
                        </Box>
                      )}
                      {/* <img src={user.user_profile_photo} alt={user.user_first_name} className={styles.profileImage} /> */}
                      <Box ml={2}>
                        <Typography variant="body1">{`${user.user_first_name} ${user.user_middle_name || ''} ${user.user_last_name || ''}`.trim()}</Typography>
                        <Typography variant="body2">{user.user_email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className={styles.tableCell}>{user.user_type}</TableCell>
                  <TableCell className={styles.tableCell}>{user.user_phone_number}</TableCell>
                  <TableCell style={{ color: statusColor }}>{statusText}</TableCell>
                  <TableCell className={styles.tableCell}>
                    <Link href={`/Admin/UserManagement/ViewDetails?user_id=${user.user_id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                      View Details
                    </Link>
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <IconButton onClick={() => handleDelete(user.user_id)}>
                      <DeleteIcon style={{ color: 'white' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
