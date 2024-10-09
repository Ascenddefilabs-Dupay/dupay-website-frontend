'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './pricealerts.module.css';
import { Typography, Button, TextField, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { MdEdit } from "react-icons/md";
import { IoMdSave } from "react-icons/io"
import { IoMdAdd } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

interface Currency {
    currency_id: string;
    symbol: string;
    coin_gecko_id: string;
    price_change_threshold: number;
    created_at: string;
}

interface AdminPriceAlert {
    id: number;
    content: string;
    currency: Currency;
    price_inr: string;
    created_at: string;
}

const PriceAlerts: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [priceAlertMessage, setPriceAlertMessage] = useState<string>('');
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [newCurrency, setNewCurrency] = useState({
        symbol: '',
        coin_gecko_id: '',
        price_change_threshold: ''
    });
    const [errors, setErrors] = useState({
        symbol: '',
        coin_gecko_id: '',
        price_change_threshold: ''
    });
    const [notifications, setNotifications] = useState<AdminPriceAlert[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editCurrencyId, setEditCurrencyId] = useState<string>('');
    const [editCurrency, setEditCurrency] = useState({
        symbol: '',
        coin_gecko_id: '',
        price_change_threshold: ''
    });

    const sendNotification = (title: string, message: string, icon: string, link: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: icon,
            });
            notification.onclick = () => {
                window.open(link, '_blank');
            };
        }
    };

    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission !== 'granted') {
                    alert('Notification permissions are not granted. Please enable them in your browser settings.');
                }
            });
        }
    };

    const API_BASE_URL = 'http://notificationservice-ind-255574993735.asia-south1.run.app/pricealertsapi';

    const fetchPriceAlerts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-price-alerts-user-ids/`);
            const userIds = response.data.user_ids;

            if (userIds && userIds.length > 0) {
                setUserId(userIds[0]);  // Set the first user ID
            } else {
                alert('No users with price alerts enabled.');
            }
        } catch (error) {
            console.error('Error fetching user IDs:', error);
        }
    };

    const pollPriceAlerts = async () => {
        if (!userId) {
            console.warn('User ID not set. Skipping pollPriceAlerts.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/create-price-alerts/`, {
                user_id: userId,
            });
            const message = response.data.price_alerts_content;  // Dynamic content from the backend
            if (message) {
                const messageText = Array.isArray(message) ? message.join(', ') : message;
                setPriceAlertMessage(messageText);
                sendNotification(
                    'Price Alerts',
                    messageText,
                    'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png',
                    'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages'
                );
            }
        } catch (error) {
            console.error('Error triggering price alerts:', error);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin-manage-crypto-currencies/`);
            setCurrencies(response.data);
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCurrency(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditCurrency(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Validates the form based on the operation mode.
     * @param isEditMode - Determines whether the form is in edit mode.
     * @returns Boolean indicating if the form is valid.
     */
    const validateForm = (isEditMode: boolean): boolean => {
        let valid = true;
        const formErrors = { symbol: '', coin_gecko_id: '', price_change_threshold: '' };
        const formData = isEditMode ? editCurrency : newCurrency;

        // Validate symbol
        if (!formData.symbol) {
            formErrors.symbol = 'Symbol is required.';
            valid = false;
        } else if (!/^[A-Z]{3}$/.test(formData.symbol)) {
            formErrors.symbol = 'Symbol must be 3 uppercase letters.';
            valid = false;
        }

        // Validate coin_gecko_id
        if (!formData.coin_gecko_id) {
            formErrors.coin_gecko_id = 'CoinGecko ID is required.';
            valid = false;
        }

        // Validate price_change_threshold
        if (!formData.price_change_threshold) {
            formErrors.price_change_threshold = 'Price change threshold is required.';
            valid = false;
        } else if (isNaN(Number(formData.price_change_threshold)) || Number(formData.price_change_threshold) <= 0) {
            formErrors.price_change_threshold = 'Price change threshold must be a positive number.';
            valid = false;
        }

        setErrors(formErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(false)) return;  // Pass false indicating add mode

        try {
            const response = await axios.post(`${API_BASE_URL}/admin-manage-crypto-currencies/`, {
                symbol: newCurrency.symbol,
                coin_gecko_id: newCurrency.coin_gecko_id,
                price_change_threshold: newCurrency.price_change_threshold,
            });
            setNewCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            setErrors({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            fetchCurrencies();
            alert('Currency added successfully.');
        } catch (error: any) {
            console.error('Error adding currency:', error);
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                // Assuming backend returns errors in the format { field: [errors] }
                const formattedErrors: { [key: string]: string } = {};
                for (const key in backendErrors) {
                    if (backendErrors.hasOwnProperty(key)) {
                        formattedErrors[key] = backendErrors[key].join(' ');
                    }
                }
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...formattedErrors
                }));
            } else {
                alert('An unexpected error occurred while adding the currency.');
            }
        }
    };

    const handleDelete = async (currency_id: string) => {
        if (!confirm('Are you sure you want to delete this currency?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin-manage-crypto-currencies/${currency_id}/`);
            fetchCurrencies();
            alert('Currency deleted successfully.');
        } catch (error) {
            console.error('Error deleting currency:', error);
            alert('Failed to delete currency. Please try again.');
        }
    };

    const handleEdit = (currency: Currency) => {
        setIsEditing(true);
        setEditCurrencyId(currency.currency_id);
        setEditCurrency({
            symbol: currency.symbol,
            coin_gecko_id: currency.coin_gecko_id,
            price_change_threshold: currency.price_change_threshold.toString()
        });
        setErrors({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(true)) return;  // Pass true indicating edit mode

        try {
            await axios.put(`${API_BASE_URL}/admin-manage-crypto-currencies/${editCurrencyId}/`, {
                symbol: editCurrency.symbol,
                coin_gecko_id: editCurrency.coin_gecko_id,
                price_change_threshold: editCurrency.price_change_threshold,
            });
            setIsEditing(false);
            setEditCurrencyId('');
            setEditCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            setErrors({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            fetchCurrencies();
            alert('Currency updated successfully.');
        } catch (error: any) {
            console.error('Error editing currency:', error);
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                // Assuming backend returns errors in the format { field: [errors] }
                const formattedErrors: { [key: string]: string } = {};
                for (const key in backendErrors) {
                    if (backendErrors.hasOwnProperty(key)) {
                        formattedErrors[key] = backendErrors[key].join(' ');
                    }
                }
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...formattedErrors
                }));
            } else {
                alert('An unexpected error occurred while updating the currency.');
            }
        }
    };

    const fetchLatestPriceAlerts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-latest-admin-price-alerts/`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching latest price alerts:', error);
        }
    };

    useEffect(() => {
        requestNotificationPermission();
        fetchPriceAlerts();
        fetchCurrencies();
        fetchLatestPriceAlerts();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const interval = setInterval(() => {
            pollPriceAlerts();
            fetchLatestPriceAlerts();
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, [userId]);

    return (
        <div className={styles.container}>
            <div className="main">
                <header className={styles.header}>
                    <Link href="/Admin/Notificationservice/AdminNotificationScreen">
                        <FaArrowLeft style={{ position: 'relative', right: '10px', color: 'white' }} />
                    </Link>
                    <center>
                        <div className="centeredBox">
                            <Typography variant="h4" gutterBottom>
                                Price Alerts Notification
                            </Typography>
                        </div>
                        <h6 className={styles.messagetext}>
                            No need to trigger the Price Alerts Notification users will directly get the Notification based on the price changes.
                        </h6>
                    </center>
                </header>
                <div className={styles.content}>
                    <div className={styles.leftContainer}>
                        <Typography variant="h6" gutterBottom>
                            ADD Crypto Currencies
                        </Typography>
                        <form onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
                            
                            <Box className={styles.formGroup}>
                                <TextField
                                    label="Crypto Currency"
                                    name="coin_gecko_id"
                                    placeholder='Ex: bitcoin,sui,...'
                                    value={isEditing ? editCurrency.coin_gecko_id : newCurrency.coin_gecko_id}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.coin_gecko_id}
                                    helperText={errors.coin_gecko_id}
                                    variant="outlined"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        color: 'white', // Text color within the input field
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color
                                          borderWidth: '1px', // Optional: You can adjust the border width
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color when focused
                                        },
                                      },
                                      '& .MuiInputLabel-outlined': {
                                        color: 'white', // Label color
                                        // fontWeight: 'bold', // Optional: Customize label font weight
                                      },
                                    }}
                                    required
                                    InputProps={{
                                        // style: { color: 'white', border: "1px solid white" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                />
                            </Box>

                            <Box className={styles.formGroup}>
                                <TextField
                                    label="Currency Code"
                                    name="symbol"
                                    placeholder='Ex: BTC,SUI,...'
                                    value={isEditing ? editCurrency.symbol : newCurrency.symbol}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.symbol}
                                    helperText={errors.symbol}
                                    variant="outlined"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        color: 'white', // Text color within the input field
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color
                                          borderWidth: '1px', // Optional: You can adjust the border width
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color when focused
                                        },
                                      },
                                      '& .MuiInputLabel-outlined': {
                                        color: 'white', // Label color
                                        // fontWeight: 'bold', // Optional: Customize label font weight
                                      },
                                    }}
                                    inputProps={{ maxLength: 3 }}
                                    required
                                    className='symbolText'
                                    InputProps={{
                                        // style: { color: 'white', border: "1px solid white" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                />
                            </Box>
                            <Box className={styles.formGroup}>
                                <TextField
                                    label="Price Change Threshold (%)"
                                    name="price_change_threshold"
                                    placeholder='Ex: 5,10.5,...'
                                    value={isEditing ? editCurrency.price_change_threshold : newCurrency.price_change_threshold}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.price_change_threshold}
                                    helperText={errors.price_change_threshold}
                                    type="number"
                                    variant="outlined"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        color: 'white', // Text color within the input field
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color
                                          borderWidth: '1px', // Optional: You can adjust the border width
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'white', // Border color when focused
                                        },
                                      },
                                      '& .MuiInputLabel-outlined': {
                                        color: 'white', // Label color
                                        // fontWeight: 'bold', // Optional: Customize label font weight
                                      },
                                    }}
                                    inputProps={{ step: '0.01' }}
                                    required
                                    InputProps={{
                                        // style: { color: 'white', border: "1px solid white" },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                />
                            </Box>
                            {isEditing ? (
                                <Button type="submit" className={styles.button}>
                                    Update Currency
                                </Button>
                            ) : (
                                <button 
                                type="submit" 
                                className={styles.iconButton}
                                title="Add New Currency"
                                >
                                    <IoMdAdd className={styles.icon} fontSize={28} />
                                </button>
                            )}
                            {/* <Button type="submit" className={styles.button}> */}
                                {/* {isEditing ? 'Update Currency' : 'Add Currency'} */}
                                {/* {isEditing ? 'Update Currency' : <IoMdAdd className={styles.icon} fontSize={28}/>} */}
                                {/* {isEditing ? 'Update Currency' : <IoAddCircleOutline fontSize={28}/>} */}
                            {/* </Button> */}
                            {isEditing && (
                                <Button
                                    type="button"
                                    className={styles.button}
                                    style={{ marginLeft: '10px'}}
                                    // style={{ marginLeft: '10px', background: 'grey' }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditCurrencyId('');
                                        setEditCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
                                        setErrors({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </form>
                        <div className={styles.currencyList}>
                            <Typography variant="h6" gutterBottom>
                                Existing Currencies
                            </Typography>
                            {currencies.map(currency => (
                                <div key={currency.currency_id} className={styles.currencyItem}>
                                    <span>{currency.currency_id} - {currency.symbol} ({currency.coin_gecko_id}) - Threshold: {currency.price_change_threshold}%</span>
                                    <div>
                                        <IconButton
                                        // variant="contained"
                                        className={styles.editButton}
                                        onClick={() => handleEdit(currency)}
                                        title="Edit"
                                        >
                                        <MdEdit style={{ color: '#FFFFFF'}}/>
                                        {/* Edit */}
                                        </IconButton>
                                        {/* <Button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEdit(currency)}>Edit</Button> */}
                                        <IconButton
                                        // variant="contained"
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(currency.currency_id)}
                                        title="Delete"
                                        >
                                        <DeleteIcon style={{ color: '#FFFFFF' }} />
                                        {/* Delete */}
                                        </IconButton>
                                        {/* <Button className={styles.button} onClick={() => handleDelete(currency.currency_id)}>Delete</Button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.rightContainer}>
                        <Typography variant="h6" gutterBottom>
                            Latest 5 Days Price Alerts
                        </Typography>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 20).map(alert => (
                                <div key={alert.id} className={styles.notificationItem}>
                                    <Typography variant="body1">{alert.content}</Typography>
                                    <Typography variant="body2" color="gray">{new Date(alert.created_at).toLocaleString()}</Typography>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body1">No price alerts available.</Typography>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceAlerts;
