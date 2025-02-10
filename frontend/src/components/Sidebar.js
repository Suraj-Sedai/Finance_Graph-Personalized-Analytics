import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Plus, Grid, Settings, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  // Retrieve the username and profile picture URL from localStorage
  const username = localStorage.getItem("username") || "Username";
  const profilePicture = localStorage.getItem("profilePicture"); // URL of the uploaded profile picture

  // Logout function clears token, username, and profilePicture then redirects
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <SidebarButton Icon={Home} text=" Home" to="/home" />
        <SidebarButton Icon={Plus} text=" Add Data" to="/add-transaction" />
        <SidebarButton Icon={Grid} text=" View All" to="/transactions" />
        <SidebarButton Icon={Settings} text=" Settings" to="/settings" />
      </nav>
      <div className="user">
        <div className="user-info">
          {profilePicture ? (
            <img className="avatar" src={profilePicture} alt="User Avatar" />
          ) : (
            <User className="avatar default-avatar" />
          )}
          <span className="username">{username}</span>
        </div>
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
