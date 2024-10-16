import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Define the structure of session data
interface SessionData {
  user_id: string;
  user_first_name: string;
  user_email: string;
  user_phone_number: string;
  session_id: string;
  expiration: string; // Assuming expiration is stored as a string
}

const UseSession = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<SessionData | null>(null); // Store user data including user_id

  useEffect(() => {
    const checkSession = () => {
      const sessionDataString = localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData: SessionData = JSON.parse(sessionDataString);
        const now = new Date();
        const expirationDate = new Date(sessionData.expiration);

        if (now > expirationDate) {
          clearSession();
          alert('Session expired. Please log in again.');
          router.push('/Userauthentication/SignIn');
          window.location.reload();
        } else {
          setIsLoggedIn(true);
          setUserData(sessionData); // Store session data, including user_id

          const timeUntilExpiration = expirationDate.getTime() - now.getTime();
          setTimeout(() => {
            clearSession();
            router.push('/Userauthentication/SignIn');
            window.location.reload();
          }, timeUntilExpiration);
        }
      }
    };

    checkSession();

    const intervalId = setInterval(checkSession, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [router]);

  const clearSession = () => {
    Cookies.remove('user_id');
    Cookies.remove('user_first_name');
    Cookies.remove('user_email');
    Cookies.remove('user_phone_number');
    Cookies.remove('session_id');
    localStorage.removeItem('session_data');
    setIsLoggedIn(false);
    setUserData(null);
  };

  return { isLoggedIn, userData, clearSession };
};

export default UseSession;
