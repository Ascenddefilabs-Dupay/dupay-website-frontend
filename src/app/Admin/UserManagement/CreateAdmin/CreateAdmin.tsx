'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import styles from './CreateAdmin.module.css'; // Importing CSS module
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';


const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // user_joined_date:'',
    user_first_name: '',
    user_last_name: '',
    password: '',
    user_password: '',
    user_gender:'',
    user_email: '',
    user_phone_number: '',
    user_dob: '',
    user_type: 'admin',
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
    const prefix = 'DupA';
    const paddedIndex = String(index).padStart(4, '0');
    return `${prefix}${paddedIndex}`;
  };

  let userCount = 1; 
  // eslint-disable-next-line prefer-const
  let userId = generateUserId(userCount);


  const checkUserIdUnique = async (userId: string): Promise<boolean> => {
    try {
      const response = await axios.get(`http://localhost:8000/createadminapi/AdminUser/${userId}/`);
      console.log('Response:', response);
      return false; // User ID is not unique (exists)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('User ID is unique. 404 Not Found');
        return true; // User ID is unique
      }
      console.error('Error checking user ID:', error);
      return false; // Default to false if there's an unknown error
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prevData) => ({
      ...prevData,
      user_joined_date: today,
      
    }));
  }, []);
  
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
    const hashedPassword = bcrypt.hashSync(formData.user_password, 10);

    const response = await axios.post(
      'http://localhost:8000/createadminapi/AdminUser/',
      {
        user_id: newUserId,
        ...formData,
        user_password: hashedPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
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
             <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'630px', color: 'white'}} />
          </Link>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Add Admin
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
	      {/* Date */}
        {/* <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            Date Joined:
          </Typography>
          <Typography variant="body1" className={styles.defaultDate}>
            {formData.user_joined_date}
          </Typography>
        </Box> */}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
          />
        </Box>

        {/* gender */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            gender: <span className={styles.required}>*</span>
          </Typography>
          <select
            name="user_gender"
            value={formData.user_gender}
            onChange={handleSelectChange} // Use handleSelectChange for select inputs
            className={styles.input}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
          />
        </Box>

        
        {/* Submit Button */}
        <Button type="submit" variant="contained"  className={styles.submitButton}>
          SUBMIT
        </Button>
      </Box>
    </div>
  );
};

export default RegisterForm;