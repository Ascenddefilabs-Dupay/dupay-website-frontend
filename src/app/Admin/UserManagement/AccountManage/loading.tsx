"use client";
import React, { useState, useEffect } from 'react';
import LottieAnimationLoading from '../../assets/LoadingAnimation';

const Loading: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false); // Hide the loading animation after the specified delay
    }, 5000); // Set the delay time in milliseconds (e.g., 5000ms = 5 seconds)

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  if (!showLoading) {
    return null; // Return null or replace with the main content you want to show after loading
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
  );
};

export default Loading;