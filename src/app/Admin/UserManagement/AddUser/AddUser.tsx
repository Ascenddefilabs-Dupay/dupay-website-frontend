'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import styles from './AddUser.module.css'; // Importing CSS module

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    user_first_name: '',
    user_last_name: '',
    password: '',
    user_password: '',
    user_email: '',
    user_phone_number: '',
    user_state: '',
    user_country: '',
    user_pin_code: '',
    user_city: '',
    user_dob: '',
    user_address_line_1: '',
    user_type: 'customer', // Default value
  });

  const [errors, setErrors] = useState({
    missingFields: false,
    passwordMismatch: false,
    emailInvalid: false,
    phoneInvalid: false,
    nameInvalid: false,
    dobInvalid: false,
  });

  const generateUserId = (index: number) => {
    const prefix = 'DupC';
    const paddedIndex = String(index).padStart(4, '0');
    return `${prefix}${paddedIndex}`;
  };

  let userCount = 1; 
  // eslint-disable-next-line prefer-const
  let userId = generateUserId(userCount); 

  const checkUserIdUnique = async (userId: string): Promise<boolean> => {
    try {
      await axios.get(`http://localhost:8000/usermanagementapi/profile/${userId}/`);
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return true;
      }
      console.error('Error checking user ID:', error);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const age = calculateAge(formData.user_dob);
    
    const newErrors = {
      missingFields: false,
      passwordMismatch: formData.password !== formData.user_password,
      emailInvalid: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email),
      phoneInvalid: !/^\d{10}$/.test(formData.user_phone_number),
      nameInvalid: formData.user_first_name.trim() === '' || formData.user_last_name.trim() === '',
      dobInvalid: formData.user_dob === '' || age < 18,
    };

    newErrors.missingFields = Object.values(formData).some((field) => field === '');

    setErrors(newErrors);

    return !newErrors.missingFields && !newErrors.passwordMismatch && !newErrors.emailInvalid && !newErrors.phoneInvalid && !newErrors.nameInvalid && !newErrors.dobInvalid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      if (errors.missingFields) {
        alert('Please fill all required details.');
      }
      if (errors.passwordMismatch) {
        alert('Passwords do not match.');
      }
      if (errors.emailInvalid) {
        alert('Invalid email format.');
      }
      if (errors.phoneInvalid) {
        alert('Invalid phone number. Must be 10 digits.');
      }
      if (errors.nameInvalid) {
        alert('First name and last name cannot be empty.');
      }
      if (errors.dobInvalid) {
        alert('You must be at least 18 years old.');
      }
      return;
    }

    let isUniqueUserId = false;
    let newUserId = userId;

    while (!isUniqueUserId) {
      isUniqueUserId = await checkUserIdUnique(newUserId);

      if (!isUniqueUserId) {
        userCount += 1;
        newUserId = generateUserId(userCount);
      }
    }

    try {
      // Hash the password before sending it
      const hashedPassword = bcrypt.hashSync(formData.user_password, 10);

      const response = await axios.post(
        'http://localhost:8000/usermanagementapi/profile/',
        {
          user_id: newUserId,
          ...formData,
          user_password: hashedPassword, // Send hashed password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('User added successfully!');
        console.log('Form Data:', {
          user_id: newUserId,
          ...formData,
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        alert('An error occurred while adding the user. Please try again.');
      } else {
        console.error('Unknown error:', error);
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div className={styles.page}>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Add Users
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
        {/* First Name */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            First Name: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_first_name"
            value={formData.user_first_name}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Last Name */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Last Name: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_last_name"
            value={formData.user_last_name}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Email */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            E-Mail: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_email"
            value={formData.user_email}
            onChange={handleInputChange}
            className={styles.textField}
            error={errors.emailInvalid}
            helperText={errors.emailInvalid ? 'Invalid email format.' : ''}
          />
        </Box>

        {/* Phone Number */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Phone Number: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_phone_number"
            value={formData.user_phone_number}
            onChange={handleInputChange}
            className={styles.textField}
            error={errors.phoneInvalid}
            helperText={errors.phoneInvalid ? 'Invalid phone number. Must be 10 digits.' : ''}
          />
        </Box>

        {/* Date of Birth */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Date of Birth: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            name="user_dob"
            value={formData.user_dob}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            className={styles.textField}
            error={errors.dobInvalid}
            helperText={errors.dobInvalid ? 'You must be at least 18 years old.' : ''}
          />
        </Box>

        {/* City */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            City: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_city"
            value={formData.user_city}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* State */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            State: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_state"
            value={formData.user_state}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Country */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Country: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_country"
            value={formData.user_country}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Password */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Password: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Confirm Password */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Confirm Password: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_password"
            type="password"
            value={formData.user_password}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* PIN Code */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            PIN Code: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_pin_code"
            value={formData.user_pin_code}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Address */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Address: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="user_address_line_1"
            value={formData.user_address_line_1}
            onChange={handleInputChange}
            className={styles.textField}
          />
        </Box>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
          SUBMIT
        </Button>
      </Box>
    </div>
  );
};

export default RegisterForm;