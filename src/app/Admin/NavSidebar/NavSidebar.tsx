/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
// import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./NavSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBars, 
} from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const AdminDashboard: React.FC = () => {
//   const [isSidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const imageUrls =
    "https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png";

  
    const toggleSidebar = () => {
      setMenuVisible(!menuVisible); // Toggle sidebar visibility
    };
  

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
          <FontAwesomeIcon
            icon={faBars}
            className={styles.menuIcon}
            onClick={toggleSidebar}
          />
          <img
            src={imageUrls}
            alt="Logo"
            width={80}
            height={80}
            style={{ marginLeft: "-10px" }}
          />
          <h1 className={styles.logo}>Dupay</h1>
        </div>

        <div className={styles.profileSection}>
          <FontAwesomeIcon icon={faUserCircle} className={styles.profileIcon} />
          <div className={styles.profileDetails}>
            <span className={styles.profileName}>Vikram</span>
            <span className={styles.profileRole}>Admin</span>
          </div>
        </div>
        {/* <FontAwesomeIcon
          icon={faBars}
          className={styles.menuIcon}
          onClick={toggleSidebar}
        /> */}
      </div>

      {/* <div className={`${styles.sidebar} ${menuVisible ? styles.sidebarVisible : ""}`}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <FontAwesomeIcon icon={faChartBar} className={styles.navIcon} />
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChartLine} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/ReportAnalysis">Report Analysis</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faUserCog} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/AccountManage">Account Management</Link>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faExchangeAlt}
                className={styles.navIcon}
              />
              <Link href="/Admin/UserManagement/TransactionHistory">Transaction Monitoring</Link>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faMoneyBillWave}
                className={styles.navIcon}
              />
              <Link href="/add-currency">Add Currency</Link>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faUserFriends}
                className={styles.navIcon}
              />
              <Link href="/Admin/UserManagement/AddUser">User Management</Link>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faBell}
                className={styles.navIcon}
              />
              <Link href="/Admin/Notificationservice/AdminNotificationScreen">Notification</Link>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faClipboardList}
                className={styles.navIcon}
              />
              <Link href="/Admin/UserManagement/AuditLogs">Audit Trail</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faUserPlus} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/CreateAdmin">Create Admin</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faLifeRing} className={styles.navIcon} />
              <Link href="/user-support">Users Support</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faUniversity} className={styles.navIcon} />
              <Link href="/add-banks">Add Banks</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
              <Link href="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </div> */}
        </div>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
