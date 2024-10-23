'use client';
import { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import styles from './WalletManagement.module.css'; // Adjust the path as needed
import Link from 'next/link';

interface Wallet {
  wallet_id: string;
  currency_type: string;
  balance: number;
}

interface CurrencyData {
  name: string;
  count: number;
}

interface TooltipPayload {
  payload: CurrencyData;
}

const WalletManagement: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const colors = [
    '#4A8EF3',
    '#F39C12',
    '#2ECC71',
    '#E74C3C',
    '#9B59B6',
    '#F1C40F',
    '#1ABC9C',
    '#3498DB',
  ];

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await fetch(
          'https://admin-user-management-255574993735.asia-south1.run.app/wallet_managementapi/profile/'
        );
        const data: Wallet[] = await response.json();
        setWallets(data);
        calculateCurrencyData(data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWallets();
  }, []);

  const calculateCurrencyData = (wallets: Wallet[]) => {
    const currencyMap: { [key: string]: { count: number } } = {};

    wallets.forEach((wallet) => {
      if (currencyMap[wallet.currency_type]) {
        currencyMap[wallet.currency_type].count += 1;
      } else {
        currencyMap[wallet.currency_type] = { count: 1 };
      }
    });

    const data = Object.entries(currencyMap).map(([name, { count }]) => ({
      name,
      count,
    }));

    setCurrencyData(data);
  };

  const handleCurrencyClick = (data: TooltipPayload[]) => {
    if (data && data.length > 0) {
      const currencyType = data[0].payload.name;
      setSelectedCurrency(currencyType);
      filterWalletsByCurrency(currencyType);
    }
  };

  const filterWalletsByCurrency = (currencyType: string) => {
    const filtered = wallets.filter(
      (wallet) => wallet.currency_type === currencyType
    );
    setFilteredWallets(filtered);
  };
  const onMouseEnter = (index: number) => {
    setActiveIndex(index); // Set the active bar index on mouse enter
  };

  const onMouseLeave = () => {
    setActiveIndex(null); // Reset the active bar index on mouse leave
  };
  // Custom Tooltip component with props
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active: boolean;
    payload?: TooltipPayload[];
  }) => {
    if (active && payload && payload.length) {
      const { name, count } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#333', // Tooltip background color
          color: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <p>{`Currency: ${name}`}</p>
          <p>{`Wallet Count: ${count}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.mainContent}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Monitor Wallet Count by Currency Type
      </Typography>

      {/* Bar Chart for Currency Types */}
      <BarChart
        width={700}
        height={350}
        data={currencyData}
        onClick={(e) => handleCurrencyClick(e.activePayload as TooltipPayload[])}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        className={styles.heading}
      >
        <XAxis dataKey="name" />
        <YAxis
          label={{ value: 'Wallet Count', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip contentStyle={{ backgroundColor: '#333', color: 'white' }} content={<CustomTooltip active={true} payload={undefined} />} cursor={{ fill: 'none' }}/>
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="count" barSize={50}>
          {currencyData.map((entry, index) => (
            // <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke={activeIndex === index ? 'white' : 'none'} // Add white border when active
              strokeWidth={activeIndex === index ? 2 : 1} // Increase border width on hover
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave}
            />
          ))}
        </Bar>
      </BarChart>

      {/* Table for Wallets */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>
                Wallet ID
              </TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>
                Currency Type
              </TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>
                Balance
              </TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWallets.length > 0 ? (
              filteredWallets.map((wallet) => (
                <TableRow key={wallet.wallet_id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>{wallet.wallet_id}</TableCell>
                  <TableCell className={styles.tableCell}>{wallet.currency_type}</TableCell>
                  <TableCell className={styles.tableCell}>{wallet.balance}</TableCell>
                  <TableCell className={styles.tableCell}>
                    <Link
                      href={`/Admin/WalletTransactions?wallet_id=${wallet.wallet_id}`}
                      style={{ color: '#4A8EF3', textDecoration: 'underline' }}
                    >
                      View more
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">No wallets available for the selected currency.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
  );
};

export default WalletManagement;


// 'use client';

// import { useState, useEffect } from 'react';
// import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
// import styles from './WalletManagement.module.css'; // Adjust the path as needed
// import Link from 'next/link';

// interface Wallet {
//   wallet_id: string;
//   currency_type: string;
//   balance: number;
// }

// const WalletManagement: React.FC = () => {
//   const [wallets, setWallets] = useState<Wallet[]>([]);
//   const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
//   const [currencyData, setCurrencyData] = useState<{ name: string; count: number }[]>([]); // Changed 'total' to 'count'

//   // Define a set of colors for each currency
//   const colors = ['#4A8EF3', '#F39C12', '#2ECC71', '#E74C3C', '#9B59B6', '#F1C40F', '#1ABC9C', '#3498DB'];

//   useEffect(() => {
//     const fetchWallets = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/wallet_managementapi/profile/');
//         const data: Wallet[] = await response.json();
//         setWallets(data);
//         calculateCurrencyData(data);
//       } catch (error) {
//         console.error('Error fetching wallet data:', error);
//       }
//     };

//     fetchWallets();
//   }, []);

//   const calculateCurrencyData = (wallets: Wallet[]) => {
//     const currencyMap: { [key: string]: { count: number } } = {};

//     wallets.forEach(wallet => {
//       if (currencyMap[wallet.currency_type]) {
//         currencyMap[wallet.currency_type].count += 1;
//       } else {
//         currencyMap[wallet.currency_type] = { count: 1 };
//       }
//     });

//     const data = Object.entries(currencyMap).map(([name, { count }]) => ({
//       name,
//       count, // Now we're only tracking the count of wallets per currency
//     }));

//     setCurrencyData(data);
//   };

//   const handleCurrencyClick = async (data: any) => {
//     if (data && data.length > 0) {
//       const currencyType = data[0].payload.name;
//       try {
//         const response = await fetch(`http://localhost:8000/wallet_managementapi/profile/?currency_type=${currencyType}`);
//         const filteredData: Wallet[] = await response.json();
//         setFilteredWallets(filteredData);
//       } catch (error) {
//         console.error('Error fetching filtered wallet data:', error);
//       }
//     }
//   };

//   const CustomTooltip = ({ active, payload }: { active: boolean; payload: any }) => {
//     if (active && payload && payload.length) {
//       const { name, count } = payload[0].payload;
//       return (
//         <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
//           <p>{`Currency: ${name}`}</p>
//           <p>{`Wallet Count: ${count}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className={styles.page}>
//       <Typography variant="h4" className={styles.heading} gutterBottom>
//         Monitor Wallet Count by Currency Type
//       </Typography>

//       {/* Bar Chart for Currency Types */}
//       <BarChart
//         width={700}
//         height={350}
//         data={currencyData}
//         onClick={(e) => handleCurrencyClick(e.activePayload)}
//         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//       >
//         <XAxis dataKey="name" />
//         <YAxis label={{ value: 'Wallet Count', angle: -90, position: 'insideLeft' }} /> {/* Set the label to Wallet Count */}
//         <Tooltip content={<CustomTooltip />} />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Bar dataKey="count" barSize={50}> {/* Changed from 'total' to 'count' */}
//           {currencyData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Bar>
//       </BarChart>

//       {/* Table for Wallets */}
//       <TableContainer component={Paper} className={styles.tableContainer}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}></TableCell>
//               <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Wallet ID</TableCell>
//               <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Currency Type</TableCell>
//               <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}>Balance</TableCell>
//               <TableCell className={`${styles.tableCell} ${styles.tableHeaderCell}`}></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(filteredWallets.length > 0 ? filteredWallets : wallets).map((wallet) => (
//               <TableRow key={wallet.wallet_id} className={styles.tableRow}>
//                 <TableCell className={styles.tableCell}></TableCell>
//                 <TableCell className={styles.tableCell}>{wallet.wallet_id}</TableCell>
//                 <TableCell className={styles.tableCell}>{wallet.currency_type}</TableCell>
//                 <TableCell className={styles.tableCell}>{wallet.balance}</TableCell>
//                 <TableCell className={styles.tableCell}>
//                   <Link
//                     href={`/Admin/WalletTransactions?wallet_id=${wallet.wallet_id}`}
//                     style={{ color: '#4A8EF3', textDecoration: 'underline' }}
//                   >
//                     View more
//                   </Link>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default WalletManagement;
