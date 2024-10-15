'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import axios from 'axios';
import styles from './WalletTransactions.module.css';

interface Transaction {
  transaction_type: string;
  transaction_amount: number;
  transaction_currency: string;
  transaction_status: string;
}

const WalletTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // Use useSearchParams to get search parameters
  const wallet_id = searchParams.get('wallet_id'); // Get wallet_id from search parameters

  useEffect(() => {
    // Ensure wallet_id is available
    if (wallet_id) {
      axios.get(`https://admin-user-management-255574993735.asia-south1.run.app/transactionsapi/transactions/${wallet_id}/`)

      // axios
      //   .get(`http://localhost:8000/transactionsapi/transactions/?wallet_id=${wallet_id}`)
        .then((response) => {
          setTransactions(response.data);
          // setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching transactions:', err);
          // setError('Failed to load transactions');
          // setLoading(false);
        });
    }
  }, [wallet_id]);

  // if (loading) {
  //   return <p>Loading transactions...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Transaction History</h1>

      {/* Table header */}
      <div className={styles.transactionHeader}>
        <span className={styles.transactionHeaderItem}>Type</span>
        <span className={styles.transactionHeaderItem}>Amount</span>
        <span className={styles.transactionHeaderItem}>Currency</span>
        <span className={styles.transactionHeaderItem}>Status</span>
      </div>

      <ul className={styles.transactionList}>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li key={index} className={styles.transactionItem}>
              <span>{transaction.transaction_type}</span>
              <span>{transaction.transaction_amount}</span>
              <span>{transaction.transaction_currency}</span>
              <span>{transaction.transaction_status}</span>
            </li>
          ))
        ) : (
          <h1 className={styles.header}>No transactions found for this wallet.</h1>
        )}
      </ul>
    </div>
    // <div className={styles.container}>
    //   <h1 className={styles.header}>Transaction History</h1>
    //   <ul className={styles.transactionList}>
    //     {transactions.length > 0 ? (
    //       transactions.map((transaction, index) => (
    //         <li key={index} className={styles.transactionItem}>
    //           <span>Type: {transaction.transaction_type}</span>
    //           <span>Amount: {transaction.transaction_amount}</span>
    //           <span>Currency: {transaction.transaction_currency}</span>
    //           <span>Status: {transaction.transaction_status}</span>
    //         </li>
    //       ))
    //     ) : (
    //       <p>No transactions found for this wallet.</p>
    //     )}
    //   </ul>
    // </div>
  );
};

export default WalletTransactions;
