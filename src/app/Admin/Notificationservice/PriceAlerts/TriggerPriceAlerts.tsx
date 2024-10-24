'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


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

const TriggerPriceAlerts: React.FC = () => {
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

    const  sendNotification = (title: string, message: string, icon: string, link: string) => {
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

    const API_BASE_URL = 'http://localhost:8000/pricealertsapi';

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



    /**
     * Validates the form based on the operation mode.
     * @param isEditMode - Determines whether the form is in edit mode.
     * @returns Boolean indicating if the form is valid.
     */


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
    return null; // This component does not render anything
};
export default TriggerPriceAlerts;