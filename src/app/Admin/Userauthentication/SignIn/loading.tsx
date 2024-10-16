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

  // if (!showLoading) {
  //   return null; // Return null or replace with the main content you want to show after loading
  // }

  return (
    // <div style={styles.loaderContainer}>
    //   <div style={styles.loader}></div>
    //   {/* <p style={styles.loadingText}>LOADING</p> */}
    //   <style>{`
    //     @keyframes spin {
    //       0% { transform: rotate(45deg); }
    //       100% { transform: rotate(405deg); }
    //     }
    //     @keyframes pulse {
    //       0% {
    //         transform: scale(1);
    //         opacity: 1;
    //       }
    //       50% {
    //         transform: scale(1.2);
    //         opacity: 0.6;
    //       }
    //       100% {
    //         transform: scale(1);
    //         opacity: 1;
    //       }
    //     }
    //   `}</style>
    // </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
  );
};

// Inline CSS styles
// const styles: { [key: string]: React.CSSProperties } = {
//   loaderContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     background: 'rgba(0, 0, 0, 1.5)', // Set background color to black
//     backdropFilter: 'blur(10px) saturate(180%)',
//     WebkitBackdropFilter: 'blur(10px) saturate(180%)',
//     zIndex: 2,
//     padding: '20px',
//     borderRadius: '20px',
//     width:'400px',
//     margin:'0 auto',
//     boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
//   },
//   loader: {
//     width: '60px',
//     height: '60px',
//     background: 'linear-gradient(45deg, #ff007b, #007bff)',
//     borderRadius: '12%',
//     animation: 'spin 1s linear infinite',
//     transform: 'rotate(45deg)',
//     position: 'relative',
//     zIndex: 3,
//     boxShadow: '0 0 20px rgba(255, 0, 123, 0.7), 0 0 20px rgba(0, 123, 255, 0.7)',
//   },
//   loadingText: {
//     fontSize: '20px',
//     color: 'white',
//     letterSpacing: '2px',
//     marginTop: '20px',
//     fontFamily: 'Arial, sans-serif',
//   },
// };

export default Loading;