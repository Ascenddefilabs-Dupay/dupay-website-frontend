/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavSidebar.module.css";
import { BiLogOutCircle } from "react-icons/bi";
import { RiLogoutCircleLine } from "react-icons/ri";



const AdminDashboard: React.FC = () => {
//   const [isSidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [itemsVisible, setItemsVisible] = useState<number>(0);
  // const [visibleItem, setVisibleItem] = useState(null);
  const [visibleItem, setVisibleItem] = useState<number | null>(null);
  const [fixedItem, setFixedItem] = useState<number | null>(null); 
  
  

  const imageUrls =
    "https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png";

    // const toggleMenuVisibility = () => {
    //   setMenuVisible((prev) => !prev);
    //   if (!menuVisible) {
    //     setItemsVisible(1);
    //   } else {
    //     setItemsVisible(0);
    //   }
    // };
    // const toggleMenuVisibility = () => {
    //   setMenuVisible((prev) => !prev);
    //   setItemsVisible((prev) => (prev === 0 ? 1 : 0));
    // };
    const toggleMenuVisibility = () => {
      setMenuVisible((prev) => !prev);
      setItemsVisible((prev) => (prev === 0 ? 1 : 0));
      if (menuVisible) {
        setVisibleItem(null); // Show all icons when menu is opened
      }
    };
    useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (itemsVisible > 0 && itemsVisible < 10) {
        timer = setTimeout(() => {
          setItemsVisible((prev) => prev + 1);
        }, 200);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [itemsVisible]);
    // useEffect(() => {
    //   let timer: NodeJS.Timeout | null = null;
    //   if (itemsVisible > 0 && itemsVisible < 11) {
    //     timer = setTimeout(() => {
    //       setItemsVisible(itemsVisible + 1);
    //     }, 200);
    //   }
    //   return () => {
    //     if (timer) clearTimeout(timer);
    //   };
    // }, [itemsVisible]);
  
    // const handleItemClick = (itemIndex: number) => {
    //   if (itemIndex === visibleItem) {
    //     setVisibleItem(null); // Deselect if the same item is clicked again
    //   } else {
    //     setVisibleItem(itemIndex); // Select clicked item
    //   }
    // };  
      const handleItemClick = (itemIndex: number) => {
    setVisibleItem((prev) => (prev === itemIndex ? null : itemIndex));
    setFixedItem(itemIndex);
  };

    // const handleItemClick = (itemIndex: number) => {
    //   // Check if the clicked item is currently visible
    //   if (visibleItem === itemIndex) {
    //     setVisibleItem(null); // Hide the item if it's already visible
    //   } else {
    //     setVisibleItem(itemIndex); // Show the clicked item
    //   }
    // };
    // const toggleSidebar = () => {
    //   setMenuVisible(!menuVisible); // Toggle sidebar visibility
    // };
    // const toggleMenuVisibility = () => {
    //   setMenuVisible((prev) => !prev);
    //   if (!menuVisible) {
    //     // Start showing items one by one
    //     setItemsVisible(1);
    //   } else {
    //     // Hide all items if menu is collapsed
    //     setItemsVisible(0);
    //   }
    // };
    // useEffect(() => {
    //   let timer: NodeJS.Timeout | null = null;
    //   if (itemsVisible > 0 && itemsVisible < 9) {
    //     // Use a timer to progressively show each menu item
    //     timer = setTimeout(() => {
    //       setItemsVisible(itemsVisible + 1);
    //     }, 200); // Adjust delay to control the speed of the items appearing
    //   }
    //   return () => {
    //     if (timer) clearTimeout(timer);
    //   };
    // }, [itemsVisible]);

    useEffect(() => {
      const fetchRegistrationStats = async () => {
        try {
          const response = await fetch(
            "https://admin-user-management-255574993735.asia-south1.run.app/usermanagementapi/user-registration-stats/"
          );
          const data = await response.json();
  
          
        } catch (error) {
          console.error("Error fetching user registration stats:", error);
        }
      };
  
      fetchRegistrationStats();
    }, []);
  


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            src={imageUrls}
            alt="Logo"
            width={80}
            height={80}
            style={{ marginLeft: "0px" }}
            // className={styles.logo}
            className={`${styles.logo} ${menuVisible ? styles.logoSmall : styles.logoLarge}`}
            onClick={toggleMenuVisibility}
          />
          
        </div>
      </div>
      <div className={`${styles.sidebar} ${menuVisible ? styles.sidebarVisible : ""}`}>
        <nav className={styles.nav}>
          <ul>
        {/* {visibleItem && (
          <li
            key={visibleItem}
            className={`${styles.navIconContainer} ${styles.fixedItem}`}
            onClick={() => handleItemClick(visibleItem)}
          >
            <a href={`#item-${visibleItem}`}> {visibleItem}</a>
          </li>
        )} */}
          {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9]
          .filter((index) => index !== visibleItem)
          .map((index) => ( */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (

              <li
                key={index}
                className={styles.navIconContainer}
                onClick={() => handleItemClick(index)}
                style={{
                  display: menuVisible && itemsVisible >= index ? 'block' : 'none',
                  opacity: menuVisible && (index === visibleItem || visibleItem === null) ? 1 : 0,
                  margin: '5px 0',
                  padding: '5px',
                  pointerEvents: visibleItem !== null && visibleItem !== index ? 'none' : 'auto', // Disable others
                }}
                // style={{
                //   display: itemsVisible >= index ? "block" : "none",
                //   opacity: visibleItem === index || visibleItem === null ? 1 : 0,
                //   margin: "5px 0",
                //   padding: "5px",
                // }}
              >
                {index === 1 && (
                  <Link href="/Admin/AdminDashboard">
                    <img
                      className={styles.navIcon2}
                      alt="Dashboard"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/dashboard_2_lv0jfj.svg"
                    />
                    <span className={styles.navText}>Dashboard</span>
                  </Link>
                )}
                {index === 2 && (
                  <Link href="/Admin/UserManagement/AccountManage">
                    <img
                      className={styles.navIcon1}
                      alt="User Management"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/fa6-solid_users_vakxfv.svg"
                    />
                    <span className={styles.navText}>UserManagement</span>
                  </Link>
                )}
                {index === 3 && (
                  <Link href="/Admin/AdminCMS/LandingPage">
                    <img
                      className={styles.navIcon1}
                      alt="Content Management"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-content-management-32_1_xy7eyj.svg"
                    />
                    <span className={styles.navText}>ContentManagement</span>
                  </Link>
                )}
                {index === 4 && (
                  <Link href="/Admin/UserManagement/CreateAdmin">
                    <img
                      className={styles.navIcon1}
                      alt="Add Admin"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/Group_bc5dek.svg"
                    />
                    <span className={styles.navText}>AddAdmin</span>
                  </Link>
                )}
                {index === 5 && (
                  <Link href="/Admin/WalletManagement">
                    <img
                      className={styles.navIcon1}
                      alt="Wallet Management"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-wallet-50_1_efgyuk.svg"
                    />
                    <span className={styles.navText}>WalletManagement</span>
                  </Link>
                )}
                {index === 6 && (
                  <Link href="/Admin/UserManagement/TransactionHistory">
                    <img
                      className={styles.navIcon1}
                      alt="Transaction History"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_1_1_trg8uh.svg"
                    />
                    <span className={styles.navText}>TransactionHistory</span>
                  </Link>
                )}
                {index === 7 && (
                  <Link href="/Admin/Notificationservice/AdminNotificationScreen">
                    <img
                      className={styles.navIcon1}
                      alt="Notifications & Alerts"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_2_esa52q.svg"
                    />
                    <span className={styles.navText}>Notifications&Alerts</span>
                  </Link>
                )}
                {index === 8 && (
                  <Link href="/Admin/UserManagement/AuditLogs">
                    <img
                      className={styles.navIcon1}
                      alt="Security Auditing"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_4_bybqmd.svg"
                    />
                    <span className={styles.navText}>SecurityAuditing</span>
                  </Link>
                )}
                {index === 9 && (
                  <Link href="/user-support">
                    <img
                      className={styles.navIcon1}
                      alt="User Support"
                      src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_5_fprpes.svg"
                    />
                    <span className={styles.navText}>UserSupport</span>
                  </Link>
                )}
              </li>
            ))}
            <li className={styles.navIconContainer} style={{ display: itemsVisible >= 10 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/logout">
                <RiLogoutCircleLine className={styles.navIcon3} style={{ color: 'white', fontSize: '20px' }} />
                <span className={styles.navText}>Logout</span>
              </Link>
            </li>
            <li className={styles.navIconContainer1} style={{ display: itemsVisible >= 11 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/logout">
                <BiLogOutCircle className={styles.navIcon3} style={{ color: 'white', fontSize: '20px' }} />
                <span className={styles.navText3}>Log Out</span>
              </Link>
            </li>
            {/* <li className={styles.navIconContainer} onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 1 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/AdminDashboard">
                <img className={styles.navIcon2} alt="Dashboard" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/dashboard_2_lv0jfj.svg" />
                <span className={styles.navText}>Dashboard</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(2)} style={{ display: itemsVisible >= 2 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/AccountManage">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/fa6-solid_users_vakxfv.svg" />
                <span className={styles.navText}>UserManagement</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(3)} style={{ display: itemsVisible >= 3 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/AdminCMS/LandingPage">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-content-management-32_1_xy7eyj.svg" />
                <span className={styles.navText}>ContentManagement</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(4)} style={{ display: itemsVisible >= 4 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/CreateAdmin">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/Group_bc5dek.svg" />
                <span className={styles.navText}>AddAdmin</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(5)} style={{ display: itemsVisible >= 5 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/WalletManagement">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-wallet-50_1_efgyuk.svg" />
                <span className={styles.navText}>WalletManagement</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(6)} style={{ display: itemsVisible >= 6 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/TransactionHistory">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_1_1_trg8uh.svg" />
                <span className={styles.navText}>TransactionHistory</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(7)} style={{ display: itemsVisible >= 7 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/Notificationservice/AdminNotificationScreen">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_2_esa52q.svg" />
                <span className={styles.navText}>Notification&Alerts</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(8)} style={{ display: itemsVisible >= 8 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/AuditLogs">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_4_bybqmd.svg" />
                <span className={styles.navText}>SecurityAuditing</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} onClick={() => handleItemClick(9)} style={{ display: itemsVisible >= 9 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/user-support">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_5_fprpes.svg" />
                <span className={styles.navText}>UserSupport</span>
              </Link>
            </li>
            <li className={styles.navIconContainer} style={{ display: itemsVisible >= 10 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/logout">
                <RiLogoutCircleLine className={styles.navIcon3} style={{ color: 'white', fontSize: '20px' }} />
                <span className={styles.navText}>Logout</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
      
        </div>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
