'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './pricealerts.module.css';
import { Typography, Button, TextField, Box } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

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

    const fetchPriceAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pricealertsapi/get-price-alerts-user-ids/');
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
        try {
            const response = await axios.post('http://localhost:8000/pricealertsapi/create-price-alerts/', {
                user_id: userId,
            });

            const message = response.data.price_alerts_content;  // Dynamic content from the backend
            if (message) {
                setPriceAlertMessage(Array.isArray(message) ? message.join(', ') : message);
                sendNotification('Price Alerts', Array.isArray(message) ? message.join(', ') : message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png', 'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages');
            }
        } catch (error) {
            console.error('Error triggering price alerts:', error);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pricealertsapi/admin-manage-crypto-currencies/');
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

    const validateForm = (): boolean => {
        let valid = true;
        const newErrors = { symbol: '', coin_gecko_id: '', price_change_threshold: '' };

        // Validate symbol
        if (!newCurrency.symbol) {
            newErrors.symbol = 'Symbol is required.';
            valid = false;
        } else if (!/^[A-Z]{3}$/.test(newCurrency.symbol)) {
            newErrors.symbol = 'Symbol must be 3 uppercase letters.';
            valid = false;
        }

        // Validate coin_gecko_id
        if (!newCurrency.coin_gecko_id) {
            newErrors.coin_gecko_id = 'CoinGecko ID is required.';
            valid = false;
        }

        // Validate price_change_threshold
        if (!newCurrency.price_change_threshold) {
            newErrors.price_change_threshold = 'Price change threshold is required.';
            valid = false;
        } else if (!/^\d+(\.\d+)?$/.test(newCurrency.price_change_threshold)) {
            newErrors.price_change_threshold = 'Price change threshold must be a number.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const response = await axios.post('http://localhost:8000/pricealertsapi/admin-manage-crypto-currencies/', {
                symbol: newCurrency.symbol,
                coin_gecko_id: newCurrency.coin_gecko_id,
                price_change_threshold: newCurrency.price_change_threshold,
            });
            
            setNewCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            fetchCurrencies();
        } catch (error: any) {
            console.error('Error adding currency:', error);
            if (error.response && error.response.data) {
                // Handle validation errors from backend
                const backendErrors = error.response.data;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...backendErrors
                }));
            }
        }
    };

    const handleDelete = async (currency_id: string) => {
        if (!confirm('Are you sure you want to delete this currency?')) return;
        try {
            await axios.delete(`http://localhost:8000/pricealertsapi/admin-manage-crypto-currencies/${currency_id}/`);
            fetchCurrencies();
        } catch (error) {
            console.error('Error deleting currency:', error);
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
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate edit form
        let valid = true;
        const newErrors = { symbol: '', coin_gecko_id: '', price_change_threshold: '' };

        // Validate symbol
        if (!editCurrency.symbol) {
            newErrors.symbol = 'Symbol is required.';
            valid = false;
        } else if (!/^[A-Z]{3}$/.test(editCurrency.symbol)) {
            newErrors.symbol = 'Symbol must be 3 uppercase letters.';
            valid = false;
        }

        // Validate coin_gecko_id
        if (!editCurrency.coin_gecko_id) {
            newErrors.coin_gecko_id = 'CoinGecko ID is required.';
            valid = false;
        }

        // Validate price_change_threshold
        if (!editCurrency.price_change_threshold) {
            newErrors.price_change_threshold = 'Price change threshold is required.';
            valid = false;
        } else if (!/^\d+(\.\d+)?$/.test(editCurrency.price_change_threshold)) {
            newErrors.price_change_threshold = 'Price change threshold must be a number.';
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        try {
            await axios.put(`http://localhost:8000/pricealertsapi/admin-manage-crypto-currencies/${editCurrencyId}/`, {
                symbol: editCurrency.symbol,
                coin_gecko_id: editCurrency.coin_gecko_id,
                price_change_threshold: editCurrency.price_change_threshold,
            });
            setIsEditing(false);
            setEditCurrencyId('');
            setEditCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' });
            fetchCurrencies();
        } catch (error: any) {
            console.error('Error editing currency:', error);
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...backendErrors
                }));
            }
        }
    };

    const fetchLatestPriceAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pricealertsapi/get-latest-admin-price-alerts/');
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
                        <h6 className={styles.messagetext}>No need to trigger the Price Alerts Notification users will directly get the Notification based on the price changes.</h6>
                    </center>
                </header>
                <div className={styles.content}>
                    <div className={styles.leftContainer}>
                        <Typography variant="h6" gutterBottom>
                            Manage Crypto Currencies
                        </Typography>
                        <form onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
                            <Box className={styles.formGroup}>
                                <TextField
                                    label="Symbol"
                                    name="symbol"
                                    value={isEditing ? editCurrency.symbol : newCurrency.symbol}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.symbol}
                                    helperText={errors.symbol}
                                    inputProps={{ maxLength: 3 }}
                                    required
                                    className='symbolText'
                                    InputProps={{
                                        style: { color: 'white', border: "1px solid white" }, // Set text color to white
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' }, // Optional: Set label color to white
                                    }}
                                />
                            </Box>
                            <Box className={styles.formGroup}>
                                <TextField
                                    label="CoinGecko ID"
                                    name="coin_gecko_id"
                                    value={isEditing ? editCurrency.coin_gecko_id : newCurrency.coin_gecko_id}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.coin_gecko_id}
                                    helperText={errors.coin_gecko_id}
                                    required
                                    InputProps={{
                                        style: { color: 'white', border: "1px solid white"}, // Set text color to white
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' }, // Optional: Set label color to white
                                    }}
                                />
                            </Box>
                            <Box className={styles.formGroup}>
                                <TextField
                                    label="Price Change Threshold (%)"
                                    name="price_change_threshold"
                                    value={isEditing ? editCurrency.price_change_threshold : newCurrency.price_change_threshold}
                                    onChange={isEditing ? handleEditInputChange : handleInputChange}
                                    error={!!errors.price_change_threshold}
                                    helperText={errors.price_change_threshold}
                                    type="number"
                                    inputProps={{ step: '0.01' }}
                                    required
                                    InputProps={{
                                        style: { color: 'white', border: "1px solid white" }, // Set text color to white
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'white' }, // Optional: Set label color to white
                                    }}
                                />
                            </Box>
                            <Button type="submit" className={styles.button}>
                                {isEditing ? 'Update Currency' : 'Add Currency'}
                            </Button>
                            {isEditing && (
                                <Button
                                    type="button"
                                    className={styles.button}
                                    style={{ marginLeft: '10px', background: 'grey' }}
                                    onClick={() => { setIsEditing(false); setEditCurrencyId(''); setEditCurrency({ symbol: '', coin_gecko_id: '', price_change_threshold: '' }); setErrors({ symbol: '', coin_gecko_id: '', price_change_threshold: '' }); }}
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
                                        <Button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEdit(currency)}>Edit</Button>
                                        <Button className={styles.button} onClick={() => handleDelete(currency.currency_id)}>Delete</Button>
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
                            notifications.slice(0, 100).map(alert => (
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
