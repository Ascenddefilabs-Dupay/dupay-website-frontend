/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem, Menu } from '@mui/material';
import axios, { AxiosError } from 'axios';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './AccountManage.module.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { IoFilter } from "react-icons/io5";
import { GrStatusInfo } from "react-icons/gr";
import { IoPersonAddSharp } from "react-icons/io5";

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
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userTypeMenuAnchor, setUserTypeMenuAnchor] = useState<null | HTMLElement>(null); // New state for user type filter
  // const [openDetails, setOpenDetails] = useState<number | null>(null);

  useEffect(() => {
    axios.get('https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/')
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
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setStatusMenuAnchor(null); // Close the dropdown after selecting a status
  };
  // const handleMoreVertClick = (userId: number) => {
  //   setOpenDetails(openDetails === userId ? null : userId);
  // };

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(`https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`);

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
      return { text: 'Hold', color: 'white' };
    }

    if (user_status === 'true' || user_status === true) {
      return { text: 'Active', color: 'white' };
    } else if (user_status === 'false' || user_status === false) {
      return { text: 'Inactive', color: 'white' };
    }

    return { text: 'Inactive', color: 'white' };
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
          <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'650px', color: 'white'}} />
          </Link>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Account Management
      </Typography>
      <IconButton>
      <Link href="/Admin/UserManagement/AddUser">
      <IconButton
          className={styles.currency}
          title="Add User" 
        >
          <IoPersonAddSharp />
        </IconButton>
        </Link>
        <IconButton
          className={styles.currency}
          title="Status" 
          onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
        >
          <GrStatusInfo />
        </IconButton>
        <IconButton
          className={styles.currency}
          title="Usertype" 
          onClick={(e) => setUserTypeMenuAnchor(e.currentTarget)}
        >
          <IoFilter />
        </IconButton>
        </IconButton>
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={() => setStatusMenuAnchor(null)} // Close menu when clicked outside
          PaperProps={{
            style: {
              backgroundColor: 'rgba(128, 128, 128, 0.253)', // Set the background color
            },
          }}
        >
          <MenuItem onClick={() => handleStatusFilter('all')}  sx={{ color: 'white' }}>All</MenuItem>
          <MenuItem onClick={() => handleStatusFilter('Active')}  sx={{ color: 'white' }}>Active</MenuItem>
          <MenuItem onClick={() => handleStatusFilter('Inactive')}  sx={{ color: 'white' }}>Inactive</MenuItem>
          <MenuItem onClick={() => handleStatusFilter('Hold')}  sx={{ color: 'white' }}>Hold</MenuItem>
        </Menu>
        <Menu
          anchorEl={userTypeMenuAnchor}
          open={Boolean(userTypeMenuAnchor)}
          onClose={() => setUserTypeMenuAnchor(null)}
          PaperProps={{
            style: {
              backgroundColor: 'rgba(128, 128, 128, 0.253)',
            },
          }}
        >
          <MenuItem onClick={() => handleFilter('all')} sx={{ color: 'white' }}>All</MenuItem>
          <MenuItem onClick={() => handleFilter('user')} sx={{ color: 'white' }}>User</MenuItem>
          <MenuItem onClick={() => handleFilter('admin')} sx={{ color: 'white' }}>Admin</MenuItem>
          <MenuItem onClick={() => handleFilter('super_admin')} sx={{ color: 'white' }}>Super Admin</MenuItem>
        </Menu>
        </Box>
      <Grid container spacing={2} className={styles.statisticsContainer}>
      <Grid item xs={4}>
          <Paper className={styles.statisticBox}>
            <Typography variant="h6">Super Admins</Typography>
            <Typography variant="h4">{users.filter(user => user.user_type === 'super_admin').length}</Typography>
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
            <Typography variant="h6">Users</Typography>
            <Typography variant="h4">{users.filter(user => user.user_type === 'user').length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}></TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>UserType</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Phone Number</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Status</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Delete</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}></TableCell>
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
                  <TableCell className={`${styles.tableCell} ${styles.statusCell}`} style={{ color: statusColor ,textDecoration: 'none' }}>{statusText}</TableCell>
                  <TableCell className={styles.tableCell}>
                    <IconButton onClick={() => handleDelete(user.user_id)}>
                      <DeleteIcon style={{ color: 'white' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Link href={`/Admin/UserManagement/ViewDetails?user_id=${user.user_id}`} style={{ color: '#4A8EF3', textDecoration: 'underline' }}>
                      View more
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
  );
};

export default Dashboard;
