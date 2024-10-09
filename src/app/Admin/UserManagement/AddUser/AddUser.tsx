'use client';

import { useState , useEffect} from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import styles from './AddUser.module.css'; // Importing CSS module
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router'; // Import the useRouter hook
import { useRouter } from 'next/navigation'; 


const RegisterForm: React.FC = () => {
  const router = useRouter(); // Initialize the router
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showLoader, setShowLoader] = useState<boolean>(true);
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
    user_type: 'user', // Default value
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

    // Validation check before submission
    if (!validateForm()) {
      if (errors.missingFields) {
        toast.error('Please fill all required details.');
      }
      if (errors.passwordMismatch) {
        toast.error('Passwords do not match.');
      }
      if (errors.emailInvalid) {
        toast.error('Invalid email format.');
      }
      if (errors.phoneInvalid) {
        toast.error('Invalid phone number. Must be 10 digits.');
      }
      if (errors.nameInvalid) {
        toast.error('First name and last name cannot be empty.');
      }
      if (errors.dobInvalid) {
        toast.error('You must be at least 18 years old.');
      }
      return;
    }

    let isUniqueUserId = false;
    let newUserId = userId;

    // Ensuring the user ID is unique by checking with the server
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

      // Sending the form data to the backend API
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

      // Show success message if the user is added successfully
      if (response.status === 200 || response.status === 201) {
        toast.success('User added successfully!');
        console.log('Form Data:', {
          user_id: newUserId,
          ...formData,
        });

        // Navigate to the next page (replace '/next-page' with your actual route)
        router.push('/Admin/UserManagement/AccountManage');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        toast.error('An error occurred while adding the user. Please try again.');
      } else {
        console.error('Unknown error:', error);
        toast.error('An unknown error occurred.');
      }
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
       <Link href="/Admin/AdminDashboard">
          <FaArrowLeft  style={{position: 'relative' ,right:'630px', color: 'white'}} />
          </Link>
      <Typography variant="h4" className={styles.heading} gutterBottom>
        Add Users
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className={styles.form} mb={2}>
        {/* First Name */}
        <Box className={styles.field}>
          <Typography variant="body1" className={styles.label}>
            First Name: <span className={styles.required}>*</span>
          </Typography>
          <TextField
            fullWidth
            // variant="outlined"
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
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
            InputProps={{
              className: styles.textFieldInput, // Apply the custom input styles
            }}
          />
        </Box>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
          SUBMIT
        </Button>
        {/* ToastContainer for rendering toast notifications */}
      <ToastContainer
        position="top-center"          // Set the position of the toast notification
        autoClose={2000}               // Close the notification after 2 seconds
        hideProgressBar={true}         // Hide the progress bar
        closeOnClick={true}            // Close the toast when it's clicked
        pauseOnHover={true}            // Pause the notification on hover
        transition={Slide}             // Slide transition for the toast
      />
      </Box>
    </div>
  );
};

export default RegisterForm;
