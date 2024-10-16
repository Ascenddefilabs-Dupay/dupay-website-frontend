"use client";
import type { NextPage } from 'next';
import styles from './AdminWebPage.module.css';
import { useRouter } from 'next/navigation';
import React, {useState,useEffect,useRef} from 'react';
import MWEB from '../AdminMWeb/MWeb';
import Login from '../Userauthentication/SignIn/login';
import ForgotPassword from '../Userauthentication/SignIn/ForgotPassword/forgotpassword';




const WebpageSingle:NextPage = () => {

	const router=useRouter();
	const [isMobile, setIsMobile] = useState(false);
	const [showSignIn, setShowSignIn] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const loginModalRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
		  if (loginModalRef.current && !loginModalRef.current.contains(event.target as Node)) {
			setShowSignIn(false); // Close the login modal if clicked outside
		  }
		};
	
		if (showSignIn) {
		  document.addEventListener('mousedown', handleClickOutside);
		} else {
		  document.removeEventListener('mousedown', handleClickOutside);
		}
	
		return () => {
		  document.removeEventListener('mousedown', handleClickOutside);
		};
	  }, [showSignIn]);
	useEffect(() => {
		const handleResize = () => {
		  setIsMobile(window.innerWidth < 768); // Adjust the width as necessary
		};
	
		handleResize(); // Check on mount
		window.addEventListener('resize', handleResize);
	
		return () => {
		  window.removeEventListener('resize', handleResize);
		};
	  }, []);
	
	  // Render mobile component if in mobile view
	  if (isMobile) {
		return <MWEB />;
	  }
	  const openSignIn = () => {
		setShowSignIn(true);
	  };
	  const openForgotPassword = () => {
		setShowForgotPassword(true);
		setShowSignIn(false); // Close the sign-in form when forgot password is opened
	  };
	const navigateToSignin = () =>{
	
		router.push('/Admin/Userauthentication/SignIn');
	}
	const handleBackClick = () => {
		setShowForgotPassword(false);  // Close Forgot Password modal
		setShowSignIn(true);           // Show Sign In modal again
	  };
	  const handleSignInBackClick = () => {
		setShowForgotPassword(false);  // Close Forgot Password modal
		setShowSignIn(false);           // Show Sign In modal again
	  };
	  
  	return (
		<div>
		<div className={`${styles.webpageSingle} ${(showSignIn || showForgotPassword) ? styles.blurred : ''}`}>
      			<img className={styles.shapeIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png" />
      			<div className={styles.webpageSingleChild} />
      			{/* <div className={styles.webpageSingleItem} /> */}
      			<div className={styles.homeAboutContactParent}>
        				<div className={styles.homeAboutContact}><button className={styles.buttons} >HOME     ABOUT     CONTACT</button>     <button className={styles.button1} onClick={openSignIn}> SIGN IN </button> </div>
        				
      			</div>
      			<div className={styles.dupayLogoParent}>
        				<img className={styles.dupayLogoIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
        				<b className={styles.dupay}>Dupay</b>
      			</div>
      			<div className={styles.frameParent}>
        				<div className={styles.frameGroup}>
          					<div className={styles.titleParent}>
            						<div className={styles.title}>
              							<span className={styles.buySell}>Buy, Sell</span>{`  `}
              							<span>{`&`}</span>{` `}
              							<span className={styles.buySell}>Manage</span>{` `}
              							<span className={styles.with}>{`with `}</span>
              							<span className={styles.buyConfidence}>Confidence</span>
            						</div>
            						<div className={styles.titleWrapper}>
              							<div className={styles.title1}>Experience industry-leading security and ease of use for all your transactions. Download our app today, available on iOS, Android, and the Chrome Web Store, as well as on the Brave browser, and manage your assets with confidence!</div>
            						</div>
          					</div>
							 
          					
        				</div>
        				<img className={styles.device14pmIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727281217/5e9eeacd-2561-43f1-8826-4fcb2d62a0c5.png" />
						
      			</div>
      			
      			
        				</div>
						{showSignIn && (
							<div className={styles.overlay}>
								{/* <div className="iconiconWrapper">
									<img
										className="iconarrowLeftBack"
										alt="Back"
										src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728536746/f8f904f1-485a-42cc-93c6-a9abd4346f30.png"
										onClick={handleSignInBackClick} // Use handleBackClick here to go back
										style={{ 
											display: 'flex',
											flexDirection: 'row',
											cursor: 'pointer',
											height: '30px',
											width: '30px',
											position: 'absolute',
											top: '90px',
											left:'38%',
										}} 
									/>
								</div> */}

							<div ref={loginModalRef}>
								<Login onForgotPassword={openForgotPassword} />
							</div>
							</div>
						)}

						{/* Forgot Password Modal */}
						{showForgotPassword && (
							<div className={styles.overlay}>
								<ForgotPassword onBack={handleBackClick} />
								<div className="iconiconWrapper">
									<img
										className="iconarrowLeftBack"
										alt="Back"
										src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729070642/arrow-left-back_e8gobf.png"
										onClick={handleBackClick} 
										style={{ 
											display: 'flex',
											flexDirection: 'row',
											cursor: 'pointer',
											height: '30px',
											width: '30px',
											position: 'absolute',
											top: '90px',
											left:'38%',
										}} 
									/>
								</div>
								 
							</div>
						)}
						</div>);
        				};
        				
        				export default WebpageSingle;
        				