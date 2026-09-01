// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// function Sidebar() {
//   const menuItems = [
//     {
//       path: "/",
//       label: "Dashboard",
//       icon: "▦",
//       end: true,
//     },
//     {
//       path: "/transactions",
//       label: "Transactions",
//       icon: "▣",
//     },
//     {
//       path: "/budgets",
//       label: "Budgets",
//       icon: "◈",
//     },
//     {
//       path: "/reports",
//       label: "Reports",
//       icon: "◫",
//     },
//     {
//       path: "/settings",
//       label: "Settings",
//       icon: "⚙",
//     },
//   ];

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-menu">
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             end={item.end}
//             className={({ isActive }) =>
//               `sidebar-item ${isActive ? "active" : ""}`
//             }
//           >
//             <span className="sidebar-icon">{item.icon}</span>
//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "▦", end: true },
    { path: "/transactions", label: "Transactions", icon: "▣" },
    { path: "/budgets", label: "Budgets", icon: "◈" },
    { path: "/reports", label: "Reports", icon: "◫" },
    { path: "/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "" : "sidebar-collapsed"}`}>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;