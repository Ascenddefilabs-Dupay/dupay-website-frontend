/* eslint-disable @next/next/no-img-element */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import styles from './ViewDetails.module.css'; // Import the CSS module
import Link from 'next/link';
// import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineNoAccounts } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";
// import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// import { TbFreezeRowColumn } from "react-icons/tb";

interface User {
  user_id: string;
  user_first_name: string;
  user_middle_name?: string;
  user_last_name?: string;
  user_phone_number: string;
  user_state: string;
  user_country: string;
  user_dob: string;
  user_pin_code: string;
  user_city: string;
  user_address_line_1: string;
  user_email: string;
  user_status: string; // Assuming this is a boolean or string "true"/"false"
  getFullNmae: string;
  user_profile_photo?: string | { data: Uint8Array }; // Handle profile photo data or URL
  user_hold?: boolean; // Added the user_hold field for freezing accounts
}
const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  // Add more currency symbols as needed
};
type Balance = {
  balance: number;  // Add balance if it's supposed to be a property
  currency: string;
  currency_type: string;
  iconUrl?: string;
};

const UserProfile: React.FC = () => {
  const [user, setUserProfile] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const searchParams = useSearchParams();
  const userId = searchParams ? searchParams.get('user_id') : null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showLoader, setShowLoader] = useState<boolean>(true);
  // const [balance, setBalance] = useState<number | null>(null);
  // const [currencyType, setCurrencyType] = useState<string | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [showBalanceOnly, setShowBalanceOnly] = useState<boolean>(false);
  const [walletId, setWalletId] = useState<string | null>(null);
  // const [userId, setUserId] = useState<string | null>(null);


  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<User>(`https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`);
      setUserProfile(response.data);

      if (response.data.user_profile_photo) {
        const baseURL = 'https://admin-user-management-255574993735.asia-south1.run.app/profile_photos';
        let imageUrl = '';

        const profilePhoto = response.data.user_profile_photo;

        if (typeof profilePhoto === 'string') {
          imageUrl = profilePhoto.startsWith('http') ? profilePhoto : `${baseURL}${profilePhoto}`;
        } else if (typeof profilePhoto === 'object' && 'data' in profilePhoto) {
          const byteArray = new Uint8Array(profilePhoto.data);
          const base64String = btoa(
            byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageUrl = `data:image/jpeg;base64,${base64String}`;
        }

        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleFreezeAccount = async () => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    try {
      console.log('Sending request to:', `https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`);

      const newUserHoldState = !user?.user_hold;

      console.log('Request data:', { user_hold: newUserHoldState });

      const response = await axios.patch(
        `https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`,
        { user_hold: newUserHoldState },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Response data:', response.data);

      if (response.status === 200) {
        setUserProfile((prevUser) =>
          prevUser ? { ...prevUser, user_hold: newUserHoldState } : prevUser
        );
        alert(`User account has been ${newUserHoldState ? 'frozen' : 'unfrozen'}.`);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error freezing user account:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };
  const handleFetchBalance = async () => {
    if (!userId) {
      console.error('User ID is missing');
      alert('User ID is missing. Please check your user information.');
      return;
    }
  
    try {
      // Fetch wallet ID based on user ID
      const walletResponse = await axios.get(`https://admin-user-management-255574993735.asia-south1.run.app/transactionsapi/fiat_wallets/${userId}/`);
      const walletData = walletResponse.data;
      const fetchedWalletId = walletData?.fiat_wallet_id;
  
      if (!fetchedWalletId) {
        alert('No wallet found for this user.');
        return;
      }
  
      // Set the walletId in state
      setWalletId(fetchedWalletId);
  
      // Fetch all balances based on wallet ID
      const balancesResponse = await axios.get(`https://admin-user-management-255574993735.asia-south1.run.app/transactionsapi/fiat_wallet/${fetchedWalletId}/`);
      const balancesData: Balance[] = balancesResponse.data.fiat_wallets;
  
      if (balancesData && balancesData.length > 0) {
        // Fetch icons for each currency type
        const balancesWithIcons = await Promise.all(
          balancesData.map(async (item: Balance) => {
            console.log('Fetching icon for:', item.currency_type);
            try {
              // Fetch the icon for each currency type
              const iconResponse = await axios.get(`https://admin-user-management-255574993735.asia-south1.run.app/transactionsapi/currency-icons/${item.currency_type}/`);
              console.log('Icon Response:', iconResponse.data); // Debug log
  
              // Access the icon URL properly from the nested structure
              // const iconUrl = iconResponse.data.currency_icons?.[0]?.icon || 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727948965/61103_ttcaan.png';
              const iconData = iconResponse.data.currency_icons?.[0]?.icon;
              const iconUrl = iconData
                ? `https://res.cloudinary.com/dgfv6j82t/${iconData}` // Prepend Cloudinary URL
                : 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727948965/61103_ttcaan.png'; // Default icon URL
              console.log('Final Icon URL:', iconUrl); // Log the final icon URL
              return { ...item, iconUrl };
            } catch (iconError) {
              console.error(`Error fetching icon for currency ${item.currency_type}:`, iconError);
              return { ...item, iconUrl: '/path/to/default/icon.png' }; // Return default icon on error
            }
          })
        );
  
        setBalances(balancesWithIcons);  // Set all balances with icons
        setShowBalanceOnly((prev) => !prev);  // Toggle balance view
      } else {
        alert('No balances found for this wallet.');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert(' An error occurred while fetching balance there is no wallets based on user_id');
    }
  };
  
  
  // const handleFetchBalance = async () => {
  //   if (!userId) {
  //     console.error('User ID is missing');
  //     alert('User ID is missing. Please check your user information.');
  //     return;
  //   }

  //   try {
  //     // Fetch wallet ID based on user ID
  //     const walletResponse = await axios.get(`http://127.0.0.1:8000/transactionsapi/fiat_wallets/${userId}/`);
  //     const walletData = walletResponse.data;
  //     const fetchedWalletId = walletData?.fiat_wallet_id;

  //     if (!fetchedWalletId) {
  //       alert('No wallet found for this user.');
  //       return;
  //     }

  //     // Set the walletId in state
  //     setWalletId(fetchedWalletId);

  //     // Fetch all balances based on wallet ID
  //     const balancesResponse = await axios.get(`http://127.0.0.1:8000/transactionsapi/fiat_wallet/${fetchedWalletId}/`);
  //     const balancesData = balancesResponse.data.fiat_wallets; // Assuming this returns an array of balances

  //     if (balancesData && balancesData.length > 0) {
  //       setBalances(balancesData); // Set all balances
  //       setShowBalanceOnly((prev) => !prev); // Toggle balance view
  //     } else {
  //       alert('No balances found for this wallet.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching balance:', error);
  //     alert('An error occurred while fetching balance. Please try again.');
  //   }
  // };

  // const handleFetchBalance = async () => {
  //   if (!userId) {
  //     console.error('User ID is missing');
  //     alert('User ID is missing. Please check your user information.');
  //     return;
  //   }

  //   try {
  //     // Fetch wallet ID based on user ID
  //     const walletResponse = await axios.get(`http://127.0.0.1:8000/transactionsapi/fiat_wallets/${userId}/`);
  //     const walletData = walletResponse.data;
  //     const fetchedWalletId = walletData?.fiat_wallet_id;

  //     if (!fetchedWalletId) {
  //       alert('No wallet found for this user.');
  //       return;
  //     }

  //     // Set the walletId in state
  //     setWalletId(fetchedWalletId);

  //     // Fetch balance based on wallet ID
  //     const balanceResponse = await axios.get(`http://127.0.0.1:8000/transactionsapi/fiat_wallet/${fetchedWalletId}/`);
  //     const balanceData = balanceResponse.data.fiat_wallets[0];

  //     if (balanceData?.balance !== undefined && balanceData?.currency_type !== undefined) {
  //       setBalance(balanceData.balance);
  //       setCurrencyType(balanceData.currency_type);
  //       setShowBalanceOnly((prev) => !prev); // Toggle balance view
  //     } else {
  //       alert('No balance or currency type found for this wallet.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching balance:', error);
  //   }
  // };

  // Call handleFetchBalance when the component mounts or userId changes
  useEffect(() => {
    handleFetchBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  
  const getStatusColor = (user_hold?: boolean, user_status?: string | boolean) => {
    console.log('user_hold:', user_hold, 'user_status:', user_status); // Debugging line
    if (user_hold === true) {
      return 'gray'; // Return white if user_hold is true
    }
  
    if (user_status === 'true' || user_status === true) {
      return 'green'; // Return green if user_status is 'true' or true
    } else if (user_status === 'false' || user_status === false) {
      return 'red'; // Return red if user_status is 'false' or false
    }
    
    return 'red'; // Default color if neither condition is met
  };

  return (
    // <div className={styles.page}>
    <div className={styles.container}>
       <img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1730087391/_Shape_1_pdomat.svg" />
       <img className={styles.shapeIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1730087391/LooperGroup_1_fw9n9g.svg" />
      <div className={styles.mainContent}>
      {/* <Link href="/Admin/UserManagement/AccountManage">
          <FaArrowLeft  style={{position: 'relative' ,right:'650px', color: 'white'}} />
      </Link> */}
      <Box display="flex" justifyContent="space-between"  mb={4}>
      <Typography  className={styles.heading} gutterBottom>
        Profile Details
      </Typography>
      <IconButton>
      <IconButton
          className={styles.currency}
          title="Freeze" 
          onClick={handleFreezeAccount}
        >
          <MdOutlineNoAccounts />
        </IconButton>

      <IconButton
          className={styles.currency}
          title="SetLimit" 
        >
          <FaMoneyCheckAlt /> 
        </IconButton>
        <IconButton
          className={styles.currency}
          title="Balance" 
          onClick={handleFetchBalance}
        >
          <FaCoins />
        </IconButton>
        </IconButton>
        </Box>
      {/* Header Section */}
      {/* <Box className={styles.header}>
        <Typography variant="h5"></Typography>
      </Box> */}
      {/* Profile Content */}
      <Card className={styles.profileCard}>
      <Box className={styles.imageSection}>
          <div style={{ position: 'relative' }}>
            {profileImage ? (
              // Show profile image if available
              <img src={profileImage} alt="Profile" className={styles.profileImage} />
            ) : (
              // Show placeholder if no image
              <Box className={styles.profilePlaceholder}>
                <Typography variant="h4" className={styles.initial}>
                  {`${user?.user_first_name} ${user?.user_middle_name || ''} ${user?.user_last_name || ''}`.trim().charAt(0)}
                </Typography>
              </Box>
            )}
            {/* Status circle always visible */}
            <div
              className={styles.statusCircle}
              style={{
                backgroundColor: getStatusColor(user?.user_hold, user?.user_status)
              }}
            />
          </div>
          <Typography variant="h6">
            {`${user?.user_first_name} ${user?.user_middle_name || ''} ${user?.user_last_name || ''}`.trim()}
          </Typography>
          <Typography variant="h6">{user?.user_dob}</Typography>
          <Typography  variant="h6" >{user?.user_phone_number}</Typography>
          <Typography  variant="h6" >{user?.user_email}</Typography>
        </Box>
        <CardContent className={styles.detailsSection}>
        {showBalanceOnly ? (
    <>
      <Typography className={styles.detailValues} sx={{ mb: 1, fontSize: '1.2rem' }}>Balances </Typography>
      <ul className={styles.balanceList}>
        {balances.map((item: Balance) => {
          // Log the image URL for each item
          console.log('Image URL:', item.iconUrl);

          return (
            <li key={item.currency_type} className={styles.balanceItem}>
              <Box className={styles.detailRows} sx={{ mb: 0, p: 0 }}>
                <Typography className={styles.detailLabelss} >
                  {/* Render the currency icon on the left */}
                  {item.iconUrl ? (
                    <img 
                      src={item.iconUrl}  // Use the iconUrl here
                      alt={`icon `} 
                      style={{ width: '35px', marginRight: '10px' }} 
                      // onError={(e) => {
                      //   console.error('Failed to load image:', e);
                      //   const target = e.target as HTMLImageElement; // Type assertion
                      //   target.src = '/path/to/default/icon.png'; // Fallback image on error
                      // }} 
                    />
                  ) : (
                    <span style={{ width: '20px', marginRight: '10px' }}></span>
                  )}
                </Typography>
                <Typography className={styles.detailLabels} mb={2}>
                  {item.currency_type}
                </Typography>
                <Typography className={styles.detailcurrency}>
                  {currencySymbols[item.currency_type] || item.currency_type} {item.balance}
                </Typography>
              </Box>
            </li>
          );
        })}
      </ul>
      {/* <ul className={styles.balanceList}>
        {balances.map((item: Balance) => (
          <li key={item.currency_type} className={styles.balanceItem}>
            <Box className={styles.detailRows} sx={{ mb: 0, p: 0 }}>
            <Typography className={styles.detailLabels} mb={2}>
                {item.iconUrl ? (
                  <img 
                    src={item.iconUrl} 
                    alt={`icon `} 
                    style={{ width: '20px', marginRight: '10px' }} 
                    onError={() => console.error('Failed to load image')}
                  />
                ) : (
                  <span style={{ width: '20px', marginRight: '10px' }}></span>
                )}
              </Typography>
              <Typography className={styles.detailLabels} mb={2}>
                {item.currency_type}
              </Typography>
              <Typography className={styles.detailValue}>
                {currencySymbols[item.currency_type] || item.currency_type} {item.balance}
              </Typography>
            </Box>
          </li>
        ))}
      </ul> */}
      {/* <ul className={styles.balanceList}>
        {balances.map((item) => (
          <li key={item.currency_type} className={styles.balanceItem}>
            <Box className={styles.detailRows} sx={{ mb: 0, p: 0 }}>
              <Typography className={styles.detailLabel}>
                {item.currency_type}
              </Typography>
              <Typography className={styles.detailValue}>
                {currencySymbols[item.currency_type] || item.currency_type} {item.balance}
              </Typography>
            </Box>
          </li>
        ))}
      </ul> */}
      {/* {balances.map((item) => (
        <Box key={item.currency_type} className={styles.detailRows} sx={{ mb: 0, p: 0 }}>
          <Typography className={styles.detailLabel}>{item.currency_type}</Typography>
          <Typography className={styles.detailValue}>{currencySymbols[item.currency_type] || item.currency_type} {item.balance}</Typography>
          
        </Box>
        
      ))} */}
      <Link
            href={`/Admin/WalletTransactions?wallet_id=${walletId}`}
            style={{
              color: '#4A8EF3',
              textDecoration: 'underline',
              marginTop: '0px',
              justifyContent: 'center',
              marginLeft: '100px',
            }}
            className={styles.detailView}
          >
            View Transactions
          </Link>
    </>
          ) : (
            <>
              <Box className={styles.detailRow}>
                <Typography className={styles.detailLabel}>State: </Typography>
                <Typography className={styles.detailValue}>{user?.user_state}</Typography>
              </Box>
              <Box className={styles.detailRow}>
                <Typography className={styles.detailLabel}>Country: </Typography>
                <Typography className={styles.detailValue}>{user?.user_country}</Typography>
              </Box>
              <Box className={styles.detailRow}>
                <Typography className={styles.detailLabel}>City: </Typography>
                <Typography className={styles.detailValue}>{user?.user_city}</Typography>
              </Box>
              <Box className={styles.detailRow}>
                <Typography className={styles.detailLabel}>Pin Code: </Typography>
                <Typography className={styles.detailValue}>{user?.user_pin_code}</Typography>
              </Box>
              <Box className={styles.detailRow}>
                <Typography className={styles.detailLabel}>Address: </Typography>
                <Typography className={styles.detailValue}>{user?.user_address_line_1}</Typography>
              </Box>
              <Box className={styles.detail} sx={{ display: 'flex' }}>
          <Link href={`/Admin/UserManagement/EditDetails?user_id=${user?.user_id}`} style={{ color: '#4A8EF3', textDecoration: 'underline', justifyContent:'center' ,marginLeft: '100px'}}>
                      Edit Details
                    </Link>
                    </Box>
            </>
          )}
        </CardContent>
        {/* <CardContent className={styles.detailsSection}>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>State: </Typography>
            <Typography className={styles.detailValue}>{user?.user_state}</Typography>
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>City: </Typography>
            <Typography className={styles.detailValue}>{user?.user_city}</Typography>
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Country: </Typography>
            <Typography className={styles.detailValue}>{user?.user_country}</Typography>
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>PinCode: </Typography>
            <Typography className={styles.detailValue}>{user?.user_pin_code}</Typography>
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Address: </Typography>
            <Typography className={styles.detailValue}>{user?.user_address_line_1}</Typography>
          </Box>
          <Box className={styles.detail} sx={{ display: 'flex' }}>
          <Link href={`/Admin/UserManagement/EditDetails?user_id=${user?.user_id}`} style={{ color: '#4A8EF3', textDecoration: 'underline', justifyContent:'center' ,marginLeft: '100px'}}>
                      Edit Details
                    </Link>
                    </Box>
                    {balance !== null && currencyType !== null && (
        <Box className={styles.detailRow}>
          <Typography className={styles.detailLabel}>Balance: </Typography>
          <Typography className={styles.detailValue}>
            {currencySymbol} {balance}
          </Typography>
        </Box>
      )}
        </CardContent> */}
      </Card>
      </div>
    </div>
  );
};

export default UserProfile;
