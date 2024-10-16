"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from './login.module.css';
// import Navbar from '../LandingPage/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UseSession from './hooks/UseSession';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define types for the Google response
interface GoogleResponse {
  credential: string;
}
declare global {
  interface Window {
    google: any;
  }
}
interface UserData {
  user_id: string;
  user_first_name: string;
  user_email: string;
  user_phone_number: string;
  session_id: string;
  registration_status: boolean;
}

interface LoginProps {
  onForgotPassword: () => void; // Define the prop type explicitly
}

const Login: React.FC<LoginProps> = ({ onForgotPassword }) => {
  const router = useRouter();
  const [heading, setHeading] = useState<string>('Login');
  const { isLoggedIn, userData, clearSession } = UseSession();
  const [email, setEmail] = useState<string>('');
  const [user_type, setUser_type] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button")!,
          { theme: "outline", size: "large" }
        );
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
              callback: handleGoogleResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-button")!,
              { theme: "outline", size: "large" }
            );
          }
        };
        document.body.appendChild(script);
      }
    };

    initializeGoogleSignIn();
  }, []);
  const fetchFiatWalletId = async (userId: string) => {
    try {
      const response = await axios.get(
        `https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${userId}/`
      );
      const { fiat_wallet_id } = response.data;

      if (fiat_wallet_id === null) {
        console.log("No wallet found, setting wallet ID to null.");
      } else {
        console.log("Wallet found: ", fiat_wallet_id);
      }
    } catch (error) {
      console.error("Error fetching fiat wallet ID: ", error);
    }
  };
  const handleGoogleResponse = async (response: GoogleResponse) => {
    try {
      const res = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/google-login/', {
        token: response.credential,
      });
  
      if (res.status === 200) {
        const { user_id, user_first_name, user_email, user_phone_number, session_id,registration_status, user_status, fiat_wallet_id } = res.data;
    
            // Check if user_type is 'admin'
             // Assuming you get the user ID from the login response
        
        // Fetch the user data using the user_id to get the user_type
        const userResponse = await axios.get(`http://localhost:8000/fiatmanagementapi/user/${user_id}/`);
        const { user_type } = userResponse.data;

        // Check if user_type is 'admin'
        if (user_type !== 'admin') {
          toast.error("Admin not found.", { position: "top-center", autoClose: 5000 });
          return;
        }
  
        // Ensure user_status is a boolean
        const isRegistrationComplete = registration_status === 'true' ? true : registration_status === 'false' ? false : registration_status;
  
        LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, fiat_wallet_id);
        // alert('Logged in successfully with Google');
        toast.success("Logged in successfully with Google", { position: "top-center", autoClose:5000 });
        
        // Navigate based on user_status
        if (isRegistrationComplete) {
          router.push(`/Admin/AdminDashboard?user_type=${user_type}&user_first_name=${user_first_name}`);
        } else {
          router.push(`/Admin/AdminDashboard?user_type=${user_type}&user_first_name=${user_first_name}`);
        }
      } else {
        // alert('Google login failed.');
        toast.error("Google login failed.", { position: "top-center", autoClose:false});
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      // alert('Error during Google login.');
      toast.error("Error during Google login.", { position: "top-center", autoClose:false });
    }
    
  };
    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (otpTimer > 0) {
        timer = setInterval(() => {
          setOtpTimer((prev) => prev - 1);
        }, 1000);
      }
      return () => clearInterval(timer); // Clear the timer on unmount
    }, [otpTimer]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (loginMode === 'password') {
        // Check if OTP has already been sent
        if (otpTimer > 0) {
          // Prevent sending OTP again while timer is active
          return;
        }
  
        try {
          const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/login/', {
            user_email: email,
            user_password: password,

          });
          
  
          if (response.status === 200) {
            const { user_id } = response.data; // Assuming you get the user ID from the login response
        
        // Fetch the user data using the user_id to get the user_type
        const userResponse = await axios.get(`http://localhost:8000/fiatmanagementapi/user/${user_id}/`);
        const { user_type } = userResponse.data;

        // Check if user_type is 'admin'
        if (user_type !== 'admin') {
          toast.error("Admin not found.", { position: "top-center", autoClose: 5000 });
          return;
        }
            // await sendOtp(); // Send OTP only once
            setOtpTimer(60); // Start the OTP timer
            toast.success("OTP sent to your email.", { position: "top-center", autoClose: 5000 });
            setLoginMode('otp');
            setHeading('Two-Factor Authentication');
          } else {
            toast.error("Invalid email or password.", { position: "top-center", autoClose: false });
          }
        } catch (error) {
          toast.error("Username or password is incorrect.", { position: "top-center", autoClose: false });
        }
      } else if (loginMode === 'otp') {
        try {
          const response = await axios.post('https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/verify-otp/', {
            user_email: email,
            user_otp: otp,
          });
  
          if (response.status === 200) {
            const { user_id, user_first_name, user_email, user_phone_number, session_id, registration_status, fiat_wallet_id } = response.data;
            
        
        // Fetch the user data using the user_id to get the user_type
        const userResponse = await axios.get(`http://localhost:8000/fiatmanagementapi/user/${user_id}/`);
        const { user_type } = userResponse.data;

        // Check if user_type is 'admin'
        if (user_type !== 'admin') {    
          toast.error("Admin not found.", { position: "top-center", autoClose: 5000 });
          return;
        }
            
            LocalStorage(user_id, user_first_name, user_email, user_phone_number, session_id, fiat_wallet_id);
            toast.success("Logged in successfully", { position: "top-center", autoClose: false });

       
        
        // Fetch the user data using the user_id to get the user_type
        
  
            if (registration_status) {
              router.push(`/Admin/AdminDashboard?user_type=${user_type}&user_first_name=${user_first_name}`);
            } else {
              router.push(`/Admin/AdminDashboard?user_type=${user_type}&user_first_name=${user_first_name}`);
            }
          } else {
            toast.error("Invalid OTP.", { position: "top-center", autoClose: false });
          }
        } catch (error) {
          toast.error("Error verifying OTP.", { position: "top-center", autoClose: false });
        }
      }
    };
  
    const sendOtp = async () => {
      try {
        const response=await axios.post("https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/generate-otp/", {
          user_email: email,
        });
        // console.log("response data :",response.data);
        // if (response.status === 200) {
        // const { user_id } = response.data;
        // const userResponse = await axios.get(`http://localhost:8000/fiatmanagementapi/user/${user_id}/`);
        // const { user_type } = userResponse.data;

        
        // if (user_type !== 'admin') {
        //   toast.error("Admin not found.", { position: "top-center", autoClose: 5000 });
        //   return;
        // }
        
        setOtpTimer(60); // Start the OTP resend timer
        toast.success("OTP sent to your email.", { position: "top-center", autoClose: 5000 });
      // }
      } catch (error) {
        toast.error("Error sending OTP.", { position: "top-center", autoClose: false });
      }
    };
  
  const LocalStorage = async (
    user_id: string,
    user_first_name: string,
    user_email: string,
    user_phone_number: string,
    session_id: string,
    registration_status: boolean
  ) => {
    try {
      const walletResponse = await axios.get(
        `https://userauthentication-ind-255574993735.asia-south1.run.app/loginapi/fiat_wallet/${user_id}/`
      );
      const { fiat_wallet_id } = walletResponse.data;

      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 20);

      const sessionData = {
        session_id,
        user_id,
        user_first_name,
        user_email,
        user_phone_number,
        fiat_wallet_id: fiat_wallet_id || null,
        expiration: expirationDate.toISOString(),
      };
      localStorage.setItem("session_data", JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error fetching fiat_wallet_id:", error);
      // alert("Error fetching wallet information.");
      toast.error("Error fetching wallet information.", { position: "top-center", autoClose:false});
    }
  };

  const handleLeftArrowClick = () => {
      router.push('/Admin/AdminWebPage');
  };

  return (
    <div className={styles.container}>
  
      <header>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      </header>
        <main className={styles.main}>
        
          <div className={styles.card}>
            
          {/* <div className="iconiconWrapper">
        <img
          className="iconarrowLeftBack"
          alt="Back"
          src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728536746/f8f904f1-485a-42cc-93c6-a9abd4346f30.png"
          onClick={handleLeftArrowClick} 
          style={{ 
            display: 'flex',
            flexDirection: 'row',
            cursor: 'pointer',
            height: '30px',
            width: '30px',
            position: 'absolute',
            top: '90px',
          }} 
        />
      </div> */}
            <div className={styles.imageLogo}>
              <div className={styles.graphics}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804054/dupay_rhft2i.png" alt="logo" />
              </div>
              <h1 className={styles.title}>Dupay</h1>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your Email"
                    disabled={loginMode === 'otp' && otpTimer > 0}
                  />
                </label>
              </div>
              {loginMode === 'password' && (
                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    Password
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className={styles.passwordInput}
                      />
                      <i
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
                        onClick={() => setShowPassword(prev => !prev)}
                      />
                    </div>
                  </label>
                  <Link
                    href="#"
                    className={styles.forgotPassword}
                    onClick={onForgotPassword}
                  >
          Forgot Password?
        </Link>
                </div>
              )}
              {loginMode === 'otp' && (
                <>
                  <div className={styles.formGroup}>
                    <button
                      type="button"
                      className={styles.button}
                      onClick={sendOtp}
                      disabled={otpTimer > 0}
                    >
                      {otpTimer > 0 ? `Resend OTP IN(${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="otp">
                      Enter OTP
                      <input
                        // type="text"
                        type="tel" // Change this to 'tel' to open the numeric keypad
                        id="otp"
                        value={otp}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </>
              )}
              <div className={styles.formGroup}>
                <button type="submit" className={styles.button}>
                  {loginMode === 'password' ? 'Login' : 'Verify OTP'}
                </button>
              </div>
              {loginMode === 'password' && (
                <div className={styles.formGroup}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      setLoginMode('otp');
                      setHeading('OTP Login');
                      setOtp('');
                    }}
                  >
                    Login with OTP
                  </button>
                </div>
                
              )}
              {loginMode === 'password' && (
                <div className={styles.orContinueWith}>
                  <p>or continue with</p>
                </div>
              )}
              {loginMode === 'password' && (
                <div id="google-signin-button" className={styles.googleSignIn}>
                  <img 
                    src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804058/google_qolmfs.png" 
                    alt="Google sign-in"
                    className={styles.googleIcon}
                  />
                </div>

              )}
            </form>
          </div>
        
          <div>
             
          </div>
        
      </main>
      <ToastContainer />
    </div>
  );
}
export default Login;