/* eslint-disable @next/next/no-img-element */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import axios from 'axios';
import styles from './ViewDetails.module.css'; // Import the CSS module
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineNoAccounts } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";

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

const UserProfile: React.FC = () => {
  const [user, setUserProfile] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const searchParams = useSearchParams();
  const userId = searchParams ? searchParams.get('user_id') : null;
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<User>(`http://localhost:8000/usermanagementapi/profile/${userId}/`);
      setUserProfile(response.data);

      if (response.data.user_profile_photo) {
        const baseURL = 'http://localhost:8000/profile_photos';
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
      console.log('Sending request to:', `http://localhost:8000/usermanagementapi/profile/${userId}/`);

      const newUserHoldState = !user?.user_hold;

      console.log('Request data:', { user_hold: newUserHoldState });

      const response = await axios.patch(
        `http://localhost:8000/usermanagementapi/profile/${userId}/`,
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
    <div className={styles.page}>
      {showLoader && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
      <Link href="/Admin/UserManagement/AccountManage">
          <FaArrowLeft  style={{position: 'relative' ,right:'650px', color: 'white'}} />
      </Link>
      <Box display="flex" justifyContent="space-between"  mb={4}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Profile Details
      </Typography>
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
        >
          <FaCoins />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
