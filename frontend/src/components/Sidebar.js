import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, Plus, Grid, Settings, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Username"
  );
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture")
  );

  useEffect(() => {
    // Update username from localStorage
    const storedUsername = localStorage.getItem("username") || "Username";
    setUsername(storedUsername);

    // Check if profile picture is in localStorage
    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (!storedProfilePicture) {
      // If not, try fetching from the backend settings endpoint
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("http://127.0.0.1:8000/api/settings/", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            if (response.data.profile_picture) {
              setProfilePicture(response.data.profile_picture);
              localStorage.setItem("profilePicture", response.data.profile_picture);
            } else {
              setProfilePicture(null);
            }
          })
          .catch((error) => {
            console.error("Error fetching user settings:", error);
          });
      }
    } else {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

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

// SidebarButton uses NavLink so that it automatically gets an "active" class when its route is active.
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
