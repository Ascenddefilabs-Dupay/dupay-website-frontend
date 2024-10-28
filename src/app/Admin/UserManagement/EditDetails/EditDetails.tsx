/* eslint-disable @next/next/no-img-element */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import styles from './EditDetails.module.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

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
  user_hold?: boolean;
  user_email: string;
  user_status: string;
  user_profile_photo?: string | { data: Uint8Array };
}

const UserProfile: React.FC = () => {
  const [user, setUserProfile] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [editableUser, setEditableUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isInitialEdit, setIsInitialEdit] = useState(true);
  const searchParams = useSearchParams();
  const userId = searchParams ? searchParams.get('user_id') : null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<User>(`https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`);
      setUserProfile(response.data);
      setEditableUser(response.data);

      // Process profile photo if it exists
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

  const getStatusColor = (user_hold?: boolean, user_status?: string | boolean) => {
    if (user_hold === true) {
      return 'gray'; // Return white if user_hold is true
    }
  
    if (user_status === 'true' || user_status === true) {
      return 'green'; // Return green if user_status is 'true' or true
    } else if (user_status === 'false' || user_status === false) {
      return 'red'; // Return red if user_status is 'false' or false
    }
    
    return 'gray'; // Default color if neither condition is met
  };

  const handleSaveChanges = async () => {
    if (editableUser) {
      try {
        // Ensure email, phone number, and dob are not overwritten after the first save
        const updatedUser = {
          user_first_name: editableUser.user_first_name,
          user_middle_name: editableUser.user_middle_name,
          user_last_name: editableUser.user_last_name,
          // user_phone_number: isInitialEdit ? editableUser.user_phone_number : user?.user_phone_number,
          user_state: editableUser.user_state,
          user_country: editableUser.user_country,
          // user_dob: isInitialEdit ? editableUser.user_dob : user?.user_dob,
          user_pin_code: editableUser.user_pin_code,
          user_status:editableUser.user_status,
          user_city: editableUser.user_city,
          user_address_line_1: editableUser.user_address_line_1,
          // user_email: isInitialEdit ? editableUser.user_email : user?.user_email,
        };

        await axios.patch(`https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/profile/${userId}/`, updatedUser);
        alert('Changes saved successfully');
        
        // Once saved, mark that the user email, phone number, and dob should not be editable again
        setIsInitialEdit(false);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Error details:', axiosError.response.data);
        } else {
          console.error('Error message:', axiosError.message);
        }
      }
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    console.log('Going back');
  };


  return (
    // <div className={styles.page}>
    <div className={styles.container}>
      <img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1730087391/_Shape_1_pdomat.svg" />
      <img className={styles.shapeIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1730087391/LooperGroup_1_fw9n9g.svg" />
      <div className={styles.mainContent}>
      <Link onClick={handleBack} href={`/Admin/UserManagement/ViewDetails?user_id=${user?.user_id}`}>
          <FaArrowLeft  style={{position: 'relative' ,right:'650px', color: 'white'}} />
      </Link>
      <Box className={styles.header}>
        <Typography variant="h5">Profile Details</Typography>
      </Box>

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
          <Typography variant="h6" className={styles.detailValue}>{user?.user_dob}</Typography>
          <Typography  variant="h6" className={styles.detailValue}>{user?.user_phone_number}</Typography>
          <Typography  variant="h6" className={styles.detailValue}>{user?.user_email}</Typography>
        </Box>
        <CardContent className={styles.detailsSection}>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>State:</Typography>
            <TextField
              value={editableUser?.user_state || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_state: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput
              }}
            />
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>City:</Typography>
            <TextField
              value={editableUser?.user_city || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_city: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput
              }}
            />
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Country:</Typography>
            <TextField
              value={editableUser?.user_country || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_country: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput
              }}
            />
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Pin Code:</Typography>
            <TextField
              value={editableUser?.user_pin_code || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_pin_code: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput
              }}
            />
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Address:</Typography>
            <TextField
              value={editableUser?.user_address_line_1 || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_address_line_1: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput
              }}
            />
          </Box>
          <Box className={styles.actions}>
          <Button variant="contained" className={styles.button} onClick={handleSaveChanges}>
            Save Changes
          </Button>
          </Box>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default UserProfile;
