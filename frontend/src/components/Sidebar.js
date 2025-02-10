import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Plus, Grid, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  // Retrieve the username from localStorage (or receive it as a prop)
  const username = localStorage.getItem("username") || "Username";

  // Logout function clears the token and username then redirects
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/"); // Change this route as needed (e.g., to a login page)
  };

  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <SidebarButton Icon={Home} text=" Home" to="/" />
        <SidebarButton Icon={Plus} text=" Add Data" to="/add-data" />
        <SidebarButton Icon={Grid} text=" View All" to="/view-all" />
        <SidebarButton Icon={Settings} text=" Settings" to="/settings" />
      </nav>
      <div className="user">
        <div className="user-info">
          <div className="avatar"></div>
          <span className="username">{username}</span>
        </div>
        {/* Use a button here for logout so that clicking it triggers our logout function */}
        <button className="sidebar-button logout-button" onClick={handleLogout}>
          <LogOut className="icon" />
          <span className="sidebar-text"> Log Out</span>
        </button>
      </div>
    </aside>
  );
}

// SidebarButton uses NavLink so that it automatically gets an "active" class when its route is active
function SidebarButton({ Icon, text, to }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        "sidebar-button" + (isActive ? " active" : "")
      }
    >
      <Icon className="icon" />
      <span className="sidebar-text">{text}</span>
    </NavLink>
  );
}
