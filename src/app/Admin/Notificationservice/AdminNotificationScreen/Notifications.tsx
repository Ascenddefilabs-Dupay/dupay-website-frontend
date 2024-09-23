'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';  // Importing the custom CSS file
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const ButtonsComponent: React.FC = () => {
    const router = useRouter();

    const goToMessages = () => {
        // router.push('/Notificationservice/Messages');
        window.location.href = '/Notificationservice/Messages';
    };

    const goToProductAnnouncement = () => {
        // router.push('/Notificationservice/ProductAnnouncement');
        window.location.href = '/Notificationservice/ProductAnnouncement';
    };

    const goToSpecialOffers = () => {
        // router.push('/Notificationservice/SpecialOffers');
        window.location.href = '/Notificationservice/SpecialOffers';
    };

    const goToInsightsTips = () => {
        // router.push('/Notificationservice/InsightsTips');
        window.location.href = '/Notificationservice/InsightsTips';
    };

    const goToPriceAlerts = () => {
        // router.push('/Notificationservice/PriceAlerts');
        window.location.href = '/Notificationservice/PriceAlerts';
    };

    const goToAccountActivity = () => {
        // router.push('/Notificationservice/AccountActivity');
        window.location.href = '/Notificationservice/AccountActivity';
    };

    return (
        <div className="container">
            <Link className="link" href="/Userauthorization/AdminDashboard">
            <FaArrowLeft  style={{position: 'relative' ,right:'10px', color: 'white'}} />
            </Link>
            <h1 className="heading">Notifications</h1>
            <div className="button-grid">
                <button onClick={goToMessages} className="button button-blue">
                    Messages
                </button>
                <button onClick={goToProductAnnouncement} className="button button-green">
                    Product Announcement
                </button>
                <button onClick={goToSpecialOffers} className="button button-purple">
                    Special Offers
                </button>
                <button onClick={goToInsightsTips} className="button button-yellow">
                    Insights & Tips
                </button>
                <button onClick={goToPriceAlerts} className="button button-red">
                    Price Alerts
                </button>
                <button onClick={goToAccountActivity} className="button button-indigo">
                    Account Activity
                </button>
            </div>
        </div>
    );
};

export default ButtonsComponent;