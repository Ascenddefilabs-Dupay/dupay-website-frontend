/* eslint-disable @next/next/no-img-element */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import styles from './EditDetails.module.css';

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

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<User>(`http://localhost:8000/usermanagementapi/profile/${userId}/`);
      setUserProfile(response.data);
      setEditableUser(response.data);

      // Process profile photo if it exists
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
  const getStatusDisplay = (user_hold?: boolean, user_status?: string | boolean) => {
    if (user_hold === true) {
      return { text: 'Hold', color: 'orange' };
    }

    if (user_status === 'true' || user_status === true) {
      return { text: 'Active', color: 'green' };
    } else if (user_status === 'false' || user_status === false) {
      return { text: 'Inactive', color: 'red' };
    }

    return { text: 'Inactive', color: 'red' }; // Default to 'Inactive'
  };
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
  // const getStatusColor = (user_status?: string | boolean) => {
  //       if (user_status === 'true' || user_status === true) {
  //         return 'green';
  //       } else if (user_status === 'false' || user_status === false) {
  //         return 'red';
  //       }
  //       return 'gray'; // Default color if user_status is not set
  //     };
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

        await axios.patch(`http://localhost:8000/usermanagementapi/profile/${userId}/`, updatedUser);
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

  const handleBack = () => {
    console.log('Going back');
  };


  // if (!user) {
  //   return <Typography>Loading...</Typography>;
  // }
  const { text: statusText, color: statusColor } = getStatusDisplay(user?.user_hold, user?.user_status);

  return (
    <div className={styles.page}>
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
          <Typography style={{ color: statusColor }}>{statusText}</Typography>
        </Box>
        <CardContent className={styles.detailsSection}>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Email:</Typography>
            {/* <TextField
              value={editableUser?.user_email || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_email: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput,
                readOnly: !isInitialEdit, // Disable editing after the first save
              }}
            /> */}
            <TextField
              value={editableUser?.user_email || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_email: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput,
              }}
              disabled // This makes the field non-editable
            />
          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Phone Number:</Typography>
            <TextField
              value={editableUser?.user_phone_number || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_phone_number: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: `${styles.detailInput} ${styles.disabledInput}`, // Apply custom class
                disableUnderline: true,
              }}
              disabled // Disable the phone number field
            />

          </Box>
          <Box className={styles.detailRow}>
            <Typography className={styles.detailLabel}>Date of Birth:</Typography>
            {/* <TextField
              value={editableUser?.user_dob || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_dob: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput,
                readOnly: !isInitialEdit, // Disable editing after the first save
              }}
            /> */}
            <TextField
              value={editableUser?.user_dob || ''}
              onChange={(e) => setEditableUser(prev => prev ? { ...prev, user_dob: e.target.value } : prev)}
              fullWidth
              size="small"
              InputProps={{
                className: styles.detailInput,
              }}
              disabled // Disable the date of birth field
            />
          </Box>
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
        </CardContent>
      </Card>

      <Box className={styles.actions}>
        <Button variant="outlined" className={styles.button} onClick={handleBack} href={`/Admin/UserManagement/ViewDetails?user_id=${user?.user_id}`}>
          Back
        </Button>
        <Button variant="contained" className={styles.button} onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>
    </div>
  );
};

export default UserProfile;