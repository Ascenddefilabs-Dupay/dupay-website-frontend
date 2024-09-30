/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Typography, IconButton, Menu, MenuItem, Grid } from '@mui/material';
import styles from './ReportAnalysis.module.css'; // Import the CSS module
import { IoFilter } from "react-icons/io5";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';



interface UserData {
  user_status: boolean; // Boolean representing active (true) or inactive (false)
  user_hold: boolean; // Boolean representing if the account is on hold
}

interface TransactionData {
  transaction_timestamp: string;
  transaction_type: string;
  transaction_amount: number | string;
  transaction_status: string;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  value: number | string;
  name: string;
}
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

const ReportAnalysis = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [timeGranularity, setTimeGranularity] = useState<'day' | 'month' | 'year'>('day');
  const [systemPerformanceData, setSystemPerformanceData] = useState<PieChartData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredUserData, setFilteredUserData] = useState<PieChartData[]>([]);
  const [filters, setFilters] = useState({
    active: true,
    inactive: true,
    hold: true,
  });
  const [performanceFilters, setPerformanceFilters] = useState({
    success: true,
    failed: true,
  });

  // Fetch user data and transaction data upon page load
  useEffect(() => {
    axios
      .get('http://localhost:8000/usermanagementapi/profile/')
      .then((response) => {
        const users: UserData[] = response.data;
        setUserData(users);
        setFilteredUserData(getFilteredData(users, filters));
      })
      .catch((error) => console.error('Error fetching user data:', error));

    axios
      .get('http://localhost:8000/usermanagementapi/transactions/')
      .then((response) => {
        const transactions: TransactionData[] = response.data;
        setTransactionData(transactions);
      })
      .catch((error) => console.error('Error fetching transaction data:', error));
  }, []);
  const handlePerformanceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPerformanceFilters(prevFilters => ({ ...prevFilters, [name]: checked }));
  };

  const handleSystemPerformance = () => {
    const successfulTransactions = transactionData.filter(t => t.transaction_status === 'Success').length;
    const failedTransactions = transactionData.filter(t => t.transaction_status === 'Pending').length;
    const totalTransactions = successfulTransactions + failedTransactions;

    const performanceData: PieChartData[] = [];

    if (performanceFilters.success && successfulTransactions > 0) {
      performanceData.push({ name: 'Success Transactions', value: (successfulTransactions / totalTransactions) * 100, color: '#4CAF50' });
    }

    if (performanceFilters.failed && failedTransactions > 0) {
      performanceData.push({ name: 'Failed Transactions', value: (failedTransactions / totalTransactions) * 100, color: '#F44336' });
    }

    setSystemPerformanceData(performanceData);
  };

  useEffect(() => {
    handleSystemPerformance();
  }, [transactionData, performanceFilters]); // Include performanceFilters to re-calculate on change

  const getFilteredData = (users: UserData[], filters: { active: boolean; inactive: boolean; hold: boolean }): PieChartData[] => {
    // Count users based on filter criteria
    const activeUsersCount = filters.active ? users.filter((user) => user.user_status === true && !user.user_hold).length : 0;
    const holdUsersCount = filters.hold ? users.filter((user) => user.user_hold === true).length : 0;
    const inactiveUsersCount = filters.inactive ? users.filter((user) => user.user_status === false && !user.user_hold).length : 0;

    const filteredData: PieChartData[] = [];

    if (activeUsersCount > 0) {
      filteredData.push({ name: 'Active', value: activeUsersCount, color: '#1569C7' });
    }
    if (holdUsersCount > 0) {
      filteredData.push({ name: 'Hold', value: holdUsersCount, color: '#FF8042' });
    }
    if (inactiveUsersCount > 0) {
      filteredData.push({ name: 'Inactive', value: inactiveUsersCount, color: '#64E986' });
    }

    return filteredData;
  };

  // Function to handle checkbox changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newFilters = { ...filters, [name]: checked };
    setFilters(newFilters);
    setFilteredUserData(getFilteredData(userData, newFilters));
  };

  // Process Transaction Data for plotting the graph
  const processTransactionData = () => {
    const dataForPlot: { [key: string]: { Recieved: number; Transfer: number; Withdrawn: number; Topup: number } } = {};

    transactionData.forEach((transaction) => {
      const timestamp = new Date(transaction.transaction_timestamp);
      const transType = transaction.transaction_type;
      const amount = typeof transaction.transaction_amount === 'string' ? parseFloat(transaction.transaction_amount) : transaction.transaction_amount;

      let dateKey = '';
      if (timeGranularity === 'day') {
        dateKey = timestamp.toLocaleDateString();
      } else if (timeGranularity === 'month') {
        dateKey = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}`;
      } else if (timeGranularity === 'year') {
        dateKey = `${timestamp.getFullYear()}`;
      }

      if (!dataForPlot[dateKey]) {
        dataForPlot[dateKey] = { Recieved: 0, Transfer: 0, Withdrawn: 0, Topup: 0 };
      }

      if (transType === 'Recieved') {
        dataForPlot[dateKey].Recieved += amount;
      } else if (transType === 'Debit' || transType === 'Transfer') {
        dataForPlot[dateKey].Transfer += amount;
      } else if (transType === 'withdrawn') {
        dataForPlot[dateKey].Withdrawn += amount;
      } else if (transType === 'topup' || transType === 'topped_up' ||transType === 'deposited') {
        dataForPlot[dateKey].Topup += amount;
      }
    });

    return {
      categories: Object.keys(dataForPlot),
      RecievedValues: Object.keys(dataForPlot).map((date) => dataForPlot[date].Recieved),
      transferValues: Object.keys(dataForPlot).map((date) => dataForPlot[date].Transfer),
      withdrawalValues: Object.keys(dataForPlot).map((date) => dataForPlot[date].Withdrawn),
      TopupValues: Object.keys(dataForPlot).map((date) => dataForPlot[date].Topup),
    };
  };

  const { categories, RecievedValues, transferValues, withdrawalValues, TopupValues } = processTransactionData();

  // Render labels for the Pie Chart
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderCustomizedLabel = (props: CustomizedLabelProps) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props;
    const radius = outerRadius - 10;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14px">
        {`${name}: ${value}`}
      </text>
    );
  };

  const activeUsersCount = userData.filter(user => user.user_status === true).length;
  const holdUsersCount = userData.filter(user => user.user_hold === true).length;
  const inactiveUsersCount = userData.filter(user => user.user_status === false).length;

  // Process System Performance Data
  // const handleSystemPerformance = () => {
  //   const successfulTransactions = transactionData.filter(t => t.transaction_status === 'Success').length;
  //   const failedTransactions = transactionData.filter(t => t.transaction_status === 'Pending').length;
  //   const totalTransactions = successfulTransactions + failedTransactions;

  //   if (totalTransactions > 0) {
  //     const successPercentage = (successfulTransactions / totalTransactions) * 100;
  //     const failedPercentage = (failedTransactions / totalTransactions) * 100;
  //     setSystemPerformanceData([
  //       { name: 'Success Transactions', value: successPercentage, color: '#4CAF50' },
  //       { name: 'Failed Transactions', value: failedPercentage, color: '#F44336' },
  //     ]);
  //   }
  // };

  useEffect(() => {
    handleSystemPerformance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionData]);

  const userActivityData: PieChartData[] = [
    { name: 'Active', value: activeUsersCount, color: '#1569C7' },
    { name: 'Hold', value: holdUsersCount, color: '#FF8042' },
    { name: 'Inactive', value: inactiveUsersCount, color: '#64E986' },
  ];
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (granularity: 'day' | 'month' | 'year') => {
    setTimeGranularity(granularity);
    setAnchorEl(null);
  };
  
  return (
    <div className={styles.page}>
       <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'630px', color: 'white'}} />
          </Link>
      <Box className={styles.header}>
        <Typography variant="h4">Report Analysis</Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            style: {
              backgroundColor: '#333', // Set your desired background color here
              color: 'white', // Optional: Set text color for better visibility
            },
          },
        }}
      >
        <MenuItem onClick={() => handleClose('day')}>Daily</MenuItem>
        <MenuItem onClick={() => handleClose('month')}>Monthly</MenuItem>
        <MenuItem onClick={() => handleClose('year')}>Yearly</MenuItem>
      </Menu>

      <Grid container spacing={4} className={styles.chartGrid}>
        {/* User Activity Chart */}
        <Grid item xs={12} md={6}>
          <Box className={styles.chartContainer}>
            <Typography variant="h6" align="center" className={styles.head}>
              User Activity
            </Typography>
            <PieChart width={400} height={300}>
              <Pie  data={filteredUserData}  dataKey="value" cx="50%" cy="50%" outerRadius={100} labelLine={false} >
                {userActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }}   labelStyle={{ color: 'white' }} 
              itemStyle={{ color: 'white' }}
              formatter={(value, name) => [`${value} users`, name]} />
              {/* <Legend/> */}
            </PieChart>
            <Box className={styles.filterContainer}>
        <Typography variant="h6" style={{ color: '#fff' }}>User Status</Typography>
        <Stack direction="column" spacing={1} className={styles.filterStack}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.active}
                onChange={handleFilterChange}
                name="active"
                style={{ color: '#1569C7' }} // Match checkbox color with PieChart color
              />
            }
            label={<span style={{ color: 'white' }}>Active</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.hold}
                onChange={handleFilterChange}
                name="hold"
                style={{ color: '#FF8042' }} // Match checkbox color with PieChart color
              />
            }
            label={<span style={{ color: 'white' }}>Hold</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inactive}
                onChange={handleFilterChange}
                name="inactive"
                style={{ color: '#64E986' }} // Match checkbox color with PieChart color
              />
            }
            label={<span style={{ color: 'white' }}>Inactive</span>}
          />
        </Stack>
      </Box>
          </Box>
          
        </Grid>

        {/* System Performance Chart */}
        <Grid item xs={12} md={6}>
          <Box className={styles.chartContainer}>
            <Typography variant="h6" align="center" className={styles.head}>
              System Performance
            </Typography>
            <PieChart width={700} height={300}>
              <Pie
                data={systemPerformanceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
              >
                {systemPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* <Tooltip formatter={(value, name) => [`${value.toFixed(2)}%`, name]} /> */}
              <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }}   labelStyle={{ color: 'white' }} 
              itemStyle={{ color: 'white' }}
                formatter={(value, name) => {
                  // Convert value to a number if possible, otherwise default to 0
                  const numericValue = !isNaN(Number(value)) ? Number(value) : 0;
                  return [`${numericValue.toFixed(2)}%`, name];
                }}
              />
              {/* <Legend /> */}
            </PieChart>
            <Box className={styles.filterContainer}>
            <Typography variant="h6" style={{ color: '#fff' }}>System Performance</Typography>
            <Stack direction="column" spacing={1} className={styles.filterStack}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={performanceFilters.success}
                    onChange={handlePerformanceFilterChange}
                    name="success"
                    style={{ color: '#4CAF50' }}
                  />
                }
                label={<span style={{ color: 'white' }}>Successful Transactions</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={performanceFilters.failed}
                    onChange={handlePerformanceFilterChange}
                    name="failed"
                    style={{ color: '#F44336' }}
                  />
                }
                label={<span style={{ color: 'white' }}>Failed Transactions</span>}
              />
            </Stack>
          </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Transaction Trends Bar Chart */}
      <Box className={styles.chartContainer}>
        <Box mb={2} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" align="center" className={styles.head}>
          Transaction Trends   
        </Typography>
        <IconButton className={styles.icon} onClick={handleClick} sx={{ color: 'white', ml: 1 }} >
        <IoFilter />
        </IconButton>
        </Box>
        <BarChart width={600} height={300} data={categories.map((cat, idx) => ({ name: cat, Recieved: RecievedValues[idx], Transfer: transferValues[idx], Withdrawn: withdrawalValues[idx], Topup: TopupValues[idx] }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" 
          stroke="white"  // Set the X-axis line color to white
          tick={{ fill: 'white' }} />
          <YAxis 
          stroke="white"  // Set the Y-axis line color to white
          tick={{ fill: 'white' }}/>
          <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }}  // Tooltip background and text color
        labelStyle={{ color: 'white' }}/>
          <Legend />
          <Bar dataKey="Recieved" fill="#0000FF" />
          <Bar dataKey="Transfer" fill="#82ca9d" />
          <Bar dataKey="Withdrawn" fill="#ffc658" />
          <Bar dataKey="Topup" fill="#8A2BE2" />
        </BarChart>
      </Box>
    </div>
  );
};

export default ReportAnalysis;
