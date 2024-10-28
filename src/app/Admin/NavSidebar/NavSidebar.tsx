/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Line, Bar } from "react-chartjs-2";
import moment from "moment";
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
import { GrSystem } from "react-icons/gr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartLine,
  faWallet,
  faChartBar,
  faUserCog,
  faExchangeAlt,
  faMoneyBillWave,
  faUserFriends,
  faClipboardList,
  faUserPlus,
  faLifeRing,
  faUserCircle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  faUniversity,
  faSignOutAlt,
  faFilter,
  faBars,
  faBell, 
} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { FaWallet } from "react-icons/fa6";
import { AiOutlineAudit } from "react-icons/ai";
import { PieChart, Pie, Cell, Legend as RechartsLegend, BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Box, Typography, IconButton, Menu, MenuItem, Grid } from '@mui/material';
import { IoFilter } from "react-icons/io5";
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { BiLogOutCircle } from "react-icons/bi";



const AdminDashboard: React.FC = () => {
//   const [isSidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [itemsVisible, setItemsVisible] = useState<number>(0);
  const [visibleItem, setVisibleItem] = useState(null);

  const imageUrls =
    "https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png";

    const toggleMenuVisibility = () => {
      setMenuVisible((prev) => !prev);
      if (!menuVisible) {
        setItemsVisible(1);
      } else {
        setItemsVisible(0);
      }
    };
  
    useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (itemsVisible > 0 && itemsVisible < 10) {
        timer = setTimeout(() => {
          setItemsVisible(itemsVisible + 1);
        }, 200);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [itemsVisible]);
  
  
    const handleItemClick = (itemIndex: number) => {
      // setVisibleItem(itemIndex); 
    };
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
            className={styles.logo}
            onClick={toggleMenuVisibility}
          />
          
        </div>
      </div>
      <div className={`${styles.sidebar} ${menuVisible ? styles.sidebarVisible : ""}`}>
        <nav className={styles.nav}>
          <ul>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 1 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/AdminDashboard">
                <img className={styles.navIcon2} alt="Dashboard" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/dashboard_2_lv0jfj.svg" />
                <span className={styles.navText}>Dashboard</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 2 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/AccountManage">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689860/fa6-solid_users_vakxfv.svg" />
                <span className={styles.navText}>User Management</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 3 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/AdminCMS/LandingPage">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-content-management-32_1_xy7eyj.svg" />
                <span className={styles.navText}>Content Management</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 4 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/CreateAdmin">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/Group_bc5dek.svg" />
                <span className={styles.navText}>Add Admin</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 5 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/WalletManagement">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689859/icons8-wallet-50_1_efgyuk.svg" />
                <span className={styles.navText}>Wallet Management</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 6 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/TransactionHistory">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_1_1_trg8uh.svg" />
                <span className={styles.navText}>Transaction History</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 7 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/Notificationservice/AdminNotificationScreen">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_2_esa52q.svg" />
                <span className={styles.navText}>Notification & Alerts</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 8 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/Admin/UserManagement/AuditLogs">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_4_bybqmd.svg" />
                <span className={styles.navText}>Security Auditing</span>
              </Link>
            </li>
            <li onClick={() => handleItemClick(1)} style={{ display: itemsVisible >= 9 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/user-support">
                <img className={styles.navIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729862892/image_5_fprpes.svg" />
                <span className={styles.navText}>User Support</span>
              </Link>
            </li>
            <li style={{ display: itemsVisible >= 10 ? "block" : "none", margin: "5px 0", padding: "5px" }}>
              <Link href="/logout">
              <img className={styles.navIcon3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729689858/logout_pufsva.svg" />
                {/* <BiLogOutCircle className={styles.navIcon1} style={{ color: 'white', fontSize: '20px' }} /> */}
                <span className={styles.navText1}>Log-Out</span>
              </Link>
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
