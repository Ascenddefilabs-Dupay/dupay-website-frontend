import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Typography, IconButton, Menu, MenuItem, Grid } from '@mui/material';
import styles from './ReportAnalysis.module.css'; // Import the CSS module
import { FaFilter } from "react-icons/fa";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';



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

  // Fetch user data and transaction data upon page load
  useEffect(() => {
    axios
      .get('http://localhost:8000/usermanagementapi/profile/')
      .then((response) => {
        const users: UserData[] = response.data;
        setUserData(users);
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
  const handleSystemPerformance = () => {
    const successfulTransactions = transactionData.filter(t => t.transaction_status === 'Success').length;
    const failedTransactions = transactionData.filter(t => t.transaction_status === 'Pending').length;
    const totalTransactions = successfulTransactions + failedTransactions;

    if (totalTransactions > 0) {
      const successPercentage = (successfulTransactions / totalTransactions) * 100;
      const failedPercentage = (failedTransactions / totalTransactions) * 100;
      setSystemPerformanceData([
        { name: 'Success Transactions', value: successPercentage, color: '#4CAF50' },
        { name: 'Failed Transactions', value: failedPercentage, color: '#F44336' },
      ]);
    }
  };

  useEffect(() => {
    handleSystemPerformance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionData]);

  const userActivityData: PieChartData[] = [
    { name: 'Active Users', value: activeUsersCount, color: '#1569C7' },
    { name: 'Hold Users', value: holdUsersCount, color: '#FF8042' },
    { name: 'Inactive Users', value: inactiveUsersCount, color: '#64E986' },
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
        <MenuItem onClick={() => handleClose('day')}>Day Wise</MenuItem>
        <MenuItem onClick={() => handleClose('month')}>Month Wise</MenuItem>
        <MenuItem onClick={() => handleClose('year')}>Year Wise</MenuItem>
      </Menu>

      {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleClose('day')}>Day Wise</MenuItem>
        <MenuItem onClick={() => handleClose('month')}>Month Wise</MenuItem>
        <MenuItem onClick={() => handleClose('year')}>Year Wise</MenuItem>
      </Menu> */}
      <Grid container spacing={4} className={styles.chartGrid}>
        {/* User Activity Chart */}
        <Grid item xs={12} md={6}>
          <Box className={styles.chartContainer}>
            <Typography variant="h6" align="center" className={styles.head}>
              User Activity
            </Typography>
            <PieChart width={400} height={300}>
              <Pie data={userActivityData} dataKey="value" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={renderCustomizedLabel}>
                {userActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Box>
        </Grid>

        {/* System Performance Chart */}
        <Grid item xs={12} md={6}>
          <Box className={styles.chartContainer}>
            <Typography variant="h6" align="center" className={styles.head}>
              System Performance
            </Typography>
            {/* <PieChart width={400} height={300}>
              <Pie data={systemPerformanceData} dataKey="value" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}>
                {systemPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart> */}
            <PieChart width={700} height={300}>
              <Pie
                data={systemPerformanceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize="14px"
                    >
                      {`${name}: ${value.toFixed(2)}%`}
                    </text>
                  );
                }}
              >
                {systemPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Box>
        </Grid>
      </Grid>

      {/* Transaction Trends Bar Chart */}
      <Box className={styles.chartContainer}>
        <Box mb={2} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" align="center" className={styles.head}>
          Transaction Trends :
        </Typography>
        <IconButton onClick={handleClick} sx={{ color: 'white', ml: 1 }} >
          <FaFilter />
        </IconButton>
        </Box>
        {/* <Box marginBottom={2}>
        <FormControl variant="outlined" >
          <Select
            value={timeGranularity}
            onChange={(e) => setTimeGranularity(e.target.value as 'day' | 'month' | 'year')}
            displayEmpty
            inputProps={{ 'aria-label': 'Select time granularity' }}
          >
            <MenuItem value="day">Daily</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="year">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box> */}
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
