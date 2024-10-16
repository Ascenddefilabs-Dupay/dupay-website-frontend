import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styles from './MWeb.module.css';
import { useRouter } from 'next/navigation';
import WebpageSingle from '../AdminWebPage/AdminWebPage';

const MWEB: NextPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const [isWebsite, setIsWebsite] = useState(false);
  
  useEffect(() => {
		const handleResize = () => {
		  setIsWebsite(window.innerWidth >= 768); // Adjust the width as necessary
		};
	
		handleResize(); // Check on mount
		window.addEventListener('resize', handleResize);
	
		return () => {
		  window.removeEventListener('resize', handleResize);
		};
	  }, []);
	
	  // Render mobile component if in mobile view
	

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (sidebarVisible) {
      document.body.classList.add(styles.noScroll); // Add no-scroll class
    } else {
      document.body.classList.remove(styles.noScroll); // Remove no-scroll class
    }

    // Cleanup function to remove the class on unmount
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [sidebarVisible]);

  const navigateToPage = (page: string) => {
    router.push(page);
    setSidebarVisible(false); // Close sidebar after navigating
  };

  return (
    <>
      {isWebsite ? (
        <WebpageSingle />
      ) : (
    <div className={styles.mweb}>
      <img
        className={styles.shapeIcon}
        alt=""
        src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727325960/0beadfc1-104a-4d39-90dc-d34518823d07.png"
      />
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.dupayLogoParent}>
            <img
              className={styles.dupayLogoIcon}
              alt=""
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png"
            />
            <b className={styles.dupay}>Dupay</b>
          </div>
        </div>
        <img
          className={styles.iconmenuBurger}
          alt="menu"
          src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727327352/8ad99937-a9a6-4a4e-8eb8-f401f305b690.png"
          onClick={toggleSidebar}
        />
      </div>

      {sidebarVisible && (
        <div className={styles.sidebar}>
        <ul>
          <li onClick={() => navigateToPage('/')}>Home</li>
          <li onClick={() => navigateToPage('/about')}>About</li>
          <li onClick={() => navigateToPage('/contact')}>Contact</li>
          {/* <li className={styles.button} onClick={() => navigateToPage('/Userauthentication/SignIn')}>Sign In</li> */}
          <li className={styles.button} onClick={() => navigateToPage('/Admin/Userauthentication/SignIn')}>Sign In</li>
        </ul>
      </div>
      )}

      <div className={styles.mwebChild} />
      <div className={styles.frameGroup}>
        <div className={styles.titleParent}>
          <div className={styles.title}>
            <span className={styles.buySell}>Buy, Sell</span>
            {`  `}
            <span>{`&`}</span>
            {` `}
            <span className={styles.buySell}>Manage</span>
            {` `}
            <span className={styles.with}>{`with `}</span>
            <span className={styles.buyConfidence}>Confidence</span>
          </div>
          <img
            className={styles.device14pmIcon}
            alt=""
            src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727281217/5e9eeacd-2561-43f1-8826-4fcb2d62a0c5.png"
          />
          <div className={styles.titleWrapper}>
            <div className={styles.title1}>
              Experience industry-leading security and ease of use for all your
              transactions. Download our app today, available on iOS, Android,
              and the Chrome Web Store, as well as on the Brave browser, and
              manage your assets with confidence!
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
      </>
  );
};

export default MWEB;
