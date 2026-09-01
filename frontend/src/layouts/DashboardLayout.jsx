// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import "./DashboardLayout.css";

// function DashboardLayout() {
//   return (
//     <div className="dashboard-container">
//       <Navbar />

//       <div className="dashboard-body">
//         <Sidebar />

//         <main className="dashboard-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar isOpen={isSidebarOpen} />

        <button
          type="button"
          className={`sidebar-toggle-button ${isSidebarOpen ? "sidebar-toggle-open" : ""}`}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? "‹" : "›"}
        </button>

        <main className={`dashboard-content ${isSidebarOpen ? "" : "dashboard-content-expanded"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;