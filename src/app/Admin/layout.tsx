import React, { ReactNode } from 'react';
import NavSidebar from './NavSidebar/NavSidebar'
import Sidebar from './Sidebar/Sidebar'


interface BottomnavbarProps {
  children: ReactNode; // To handle any children passed inside Bottomnavbar
  showBottomNav?: boolean; // Optional boolean to control visibility of BottomNavBar
}

const Bottomnavbar: React.FC<BottomnavbarProps> = ({ children, showBottomNav = true }) => {
  return (
    <div>
        <header>
            <NavSidebar />
        </header>
        <aside className="sidebar">
         <Sidebar />
       </aside>
      {children}
      {showBottomNav && ( // Conditionally render BottomNavBar if showBottomNav is true
        <footer>
          {/* <BottomNavBar /> */}
        </footer>
      )}
    </div>
  );
};
// import React, { ReactNode } from 'react';
// import NavSidebar from './NavSidebar/NavSidebar';
// import Sidebar from './Sidebar/Sidebar';
// import './layout.module.css'; // Importing the CSS file

// interface BottomnavbarProps {
//   children: ReactNode; // To handle any children passed inside Bottomnavbar
//   showBottomNav?: boolean; // Optional boolean to control visibility of BottomNavBar
// }

// const Bottomnavbar: React.FC<BottomnavbarProps> = ({ children }) => {
//   return (
//     <div className="bottom-navbar-container">
//       <header>
//         <NavSidebar />
//       </header>
//         <aside className="sidebar">
//           <Sidebar />
//         </aside>
//         <main className="main-content">
//           {children}
//         </main>
//     </div>
//   );
// };

// export default Bottomnavbar;


export default Bottomnavbar;