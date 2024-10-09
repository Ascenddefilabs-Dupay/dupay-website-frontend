import React from 'react';
import Lottie from 'react-lottie';
import animationData from './Test logo.json'; // Path to your JSON file

interface LottieAnimationProps {
  width?: string;
  height?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ width = '100%', height = '100%' }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true, // Animation will play automatically
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ width, height }}>
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default LottieAnimation;
