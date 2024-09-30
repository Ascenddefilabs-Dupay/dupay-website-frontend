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
import styles from "./AdminDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTrophy,
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
  faUniversity,
  faSignOutAlt,
  faFilter,
  faBars,
  faBell, 
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

interface DailyData {
  day: string;
  count: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>("Total Users");
  const [filter, setFilter] = useState<string>("monthly");
  const [isFilterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [graphType, setGraphType] = useState<string>("line");
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const imageUrls =
    "https://res.cloudinary.com/dvjtn2d0c/image/upload/v1725961566/dupay_xnl7dc.png";

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!isFilterDropdownVisible);
  };

  const toggleSidebar = () => {
    setMenuVisible(!menuVisible); // Toggle sidebar visibility
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
    }
    return days.reverse();
  };

  const getLast6Months = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      months.push(moment().subtract(i, "months").format("YYYY-MM"));
    }
    return months.reverse();
  };

  useEffect(() => {
    const fetchRegistrationStats = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/fiatmanagementapi/user-registration-stats/"
        );
        const data = await response.json();

        const allDays = getLast7Days();
        const filledDailyData = allDays.map((day) => {
          const dayData = data.daily.find((entry: DailyData) => entry.day === day);
          return {
            day,
            count: dayData ? dayData.count : 0,
          };
        });
        setDailyData(filledDailyData);

        const allMonths = getLast6Months();
        const filledMonthlyData = allMonths.map((month) => {
          const monthData = data.monthly.find((entry: MonthlyData) => entry.month === month);
          return {
            month,
            count: monthData ? monthData.count : 0,
          };
        });
        setMonthlyData(filledMonthlyData);
      } catch (error) {
        console.error("Error fetching user registration stats:", error);
      }
    };

    fetchRegistrationStats();
  }, []);

  const chartData = filter === "daily"
    ? {
        labels: dailyData.map((entry) => entry.day),
        datasets: [
          {
            label: "Daily Registrations",
            data: dailyData.map((entry) => entry.count),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      }
    : {
        labels: monthlyData.map((entry) => entry.month),
        datasets: [
          {
            label: "Monthly Registrations",
            data: monthlyData.map((entry) => entry.count),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

      <div className={`${styles.sidebar} ${menuVisible ? styles.sidebarVisible : ""}`}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <FontAwesomeIcon icon={faChartBar} className={styles.navIcon} />
              <Link href="/Admin/AdminDashboard">Dashboard</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChartLine} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/ReportAnalysis">Report Analysis</Link>
            </li>
            <li>
<<<<<<< Updated upstream
              <FontAwesomeIcon icon={faUserCog} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/AccountManage">Account Management</Link>
=======
              <GrSystem  className={styles.navIcon} />
              <Link href="/Admin/AdminCMS">Content Management</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faUserPlus} className={styles.navIcon} />
              <Link href="/Admin/UserManagement/CreateAdmin">Create Admin</Link>
            </li>
            <li>
              <FaWallet className={styles.navIcon} />
              <Link href="/Admin/UserManagement/CreateAdmin">Wallet Management</Link>
>>>>>>> Stashed changes
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
      </div>

      <div className={styles.mainContent}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h2>
              {selectedMetric} - {filter === "monthly" ? "Monthly" : "Daily"}
            </h2>
            <div className={styles.metricIcons}>
              <FontAwesomeIcon
                icon={faUsers}
                className={`${styles.icon} ${
                  selectedMetric === "Total Users" ? styles.activeIcon : ""
                }`}
                onClick={() => setSelectedMetric("Total Users")}
                title="Total Users"
              />
              <FontAwesomeIcon
                icon={faWallet}
                className={`${styles.icon} ${
                  selectedMetric === "Total Balance" ? styles.activeIcon : ""
                }`}
                onClick={() => setSelectedMetric("Total Balance")}
                title="Total Balance"
              />
              <FontAwesomeIcon
                icon={faFilter}
                className={`${styles.icon} ${
                  isFilterDropdownVisible ? styles.activeIcon : ""
                }`}
                onClick={toggleFilterDropdown}
                title="Filter"
              />
              {isFilterDropdownVisible && (
                <div className={styles.filterDropdown}>
                  <button
                    onClick={() => {
                      setFilter("daily");
                      toggleFilterDropdown();
                    }}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => {
                      setFilter("monthly");
                      toggleFilterDropdown();
                    }}
                  >
                    Monthly
                  </button>
                </div>
              )}
              <FontAwesomeIcon
                icon={faChartBar}
                className={`${styles.icon} ${
                  graphType === "bar" ? styles.activeIcon : ""
                }`}
                onClick={() => setGraphType("bar")}
                title="Bar Graph"
              />
              <FontAwesomeIcon
                icon={faChartLine}
                className={`${styles.icon} ${
                  graphType === "line" ? styles.activeIcon : ""
                }`}
                onClick={() => setGraphType("line")}
                title="Line Graph"
              />
            </div>
          </div>
          {graphType === "line" ? (
            <Line data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
