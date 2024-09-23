'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './pricealerts.module.css';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const PriceAlerts: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [priceAlertMessage, setPriceAlertMessage] = useState<string>('');

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
      const response = await axios.get('http://notificationservice-ind-255574993735.asia-south1.run.app/pricealertsapi/get-price-alerts-user-ids/');
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
      const response = await axios.post('http://notificationservice-ind-255574993735.asia-south1.run.app/pricealertsapi/create-price-alerts/', {
        user_id: userId,
      });

      const message = response.data.price_alerts_content;  // Dynamic content from the backend
      if (message) {
        setPriceAlertMessage(message);
        sendNotification('Price Alerts', message, 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1725254311/logo3_ln9n43.png', 'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages');
      }
    } catch (error) {
      console.error('Error triggering price alerts:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchPriceAlerts();

    const interval = setInterval(() => {
      pollPriceAlerts();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className={styles.container}>
      <div className="main">
        <header className={styles.header}>
          <Link href="/Notificationservice/AdminNotificationScreen">
            <FaArrowLeft  style={{position: 'relative' ,right:'10px', color: 'white'}} />
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
      </div>
    </div>
  );
};

export default PriceAlerts;

