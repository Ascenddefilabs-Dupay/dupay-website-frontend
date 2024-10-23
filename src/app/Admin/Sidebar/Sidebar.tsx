/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
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
import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faExchangeAlt,
  faUserFriends,
  faUserPlus,
  faLifeRing,
  faSignOutAlt,
  faBell, 
} from "@fortawesome/free-solid-svg-icons";
import { GrSystem } from "react-icons/gr";
import { FaWallet } from "react-icons/fa6";
import { AiOutlineAudit } from "react-icons/ai";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const imageUrls =
    "https://res.cloudinary.com/dvjtn2d0c/image/upload/v1725961566/dupay_xnl7dc.png";



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleSidebar = () => {
    setMenuVisible(!menuVisible); // Toggle sidebar visibility
  };


  


  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
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
        </div> */}
        {/* <FontAwesomeIcon
          icon={faBars}
          className={styles.menuIcon}
          onClick={toggleSidebar}
        /> */}
      {/* </div> */}

      <div className={`${styles.sidebar} ${menuVisible ? styles.sidebarVisible : ""}`}>
        <nav className={styles.nav}>
        <ul>
            <li>
              <FontAwesomeIcon icon={faChartBar} className={styles.navIcon} />
              <Link href="/Admin/AdminDashboard">Dashboard</Link>
            </li>
            {/* <li>
              <FontAwesomeIcon icon={faChartLine} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/ReportAnalysis">Report Analysis</Link>
            </li> */}
            <li>
              <FontAwesomeIcon icon={faUserFriends} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/AccountManage">User Management</Link>
            </li>
            <li>
              <GrSystem  className={styles.navIcon} />
              <Link href="/Admin/AdminCMS/LandingPage">Content Management</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faUserPlus} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/CreateAdmin">Create Admin</Link>
            </li>
            <li>
              <FaWallet className={styles.navIcon} />
              <Link href="/Admin/WalletManagement">Wallet Management</Link>
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
                icon={faBell}
                className={styles.navIcon}
              />
              <Link href="/Admin/Notificationservice/AdminNotificationScreen">Notification&Alerts</Link>
            </li>
            <li>
              <AiOutlineAudit
                className={styles.navIcon}
              />
              <Link href="/Admin/UserManagement/AuditLogs">Security Auditing</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faLifeRing} className={styles.navIcon} />
              <Link href="/user-support">Users Support</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
              <Link href="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </div>
        </div>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
