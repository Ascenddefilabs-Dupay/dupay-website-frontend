'use client';
import React, { useEffect } from 'react';
import axios from 'axios';
const TriggerPriceAlerts: React.FC = () => {
    useEffect(() => {
        const triggerAlerts = async () => {
            try {
                // Fetch user IDs with price alerts enabled
                const userIdsResponse = await axios.get('http://notificationservice-ind-255574993735.asia-south1.run.app/pricealertsapi/get-price-alerts-user-ids/');
                const userIds = userIdsResponse.data.user_ids;
                if (!userIds || userIds.length === 0) {
                    console.warn('No users with price alerts enabled.');
                    return;
                }
                // Trigger price alerts
                await axios.post('http://notificationservice-ind-255574993735.asia-south1.run.app/pricealertsapi/create-price-alerts/', {
                    user_id: userIds[0], // Assuming you want to trigger for the first user
                });
                console.log('Price alerts triggered successfully.');
            } catch (error) {
                console.error('Error triggering price alerts:', error);
            }
        };
        triggerAlerts();
    }, []);
    return null; // This component does not render anything
};
export default TriggerPriceAlerts;