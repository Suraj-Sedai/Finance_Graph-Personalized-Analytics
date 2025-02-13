import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch current settings on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get('http://127.0.0.1:8000/api/settings/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsername(response.data.username);
        if (response.data.profile_picture) {
          setPreviewUrl(response.data.profile_picture);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        // If you want more detail:
        if (error.response) {
          console.error('Server error details:', error.response.data);
        }
      });
  }, [token, navigate]);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit updated settings via PUT (using FormData for file upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    if (password) {
      formData.append('password', password);
    }
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    try {
      const response = await axios.put(
        'http://127.0.0.1:8000/api/settings/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage('Settings updated successfully!');
      localStorage.setItem('username', response.data.username);
      if (response.data.profile_picture) {
        localStorage.setItem('profilePicture', response.data.profile_picture);
      } else {
        localStorage.removeItem('profilePicture');
      }
      
      // Reload the page or handle it another way so the Sidebar updates
      window.location.reload();
    } catch (error) {
      console.error('Error updating settings:', error);
      // If the server responded with details:
      if (error.response) {
        console.error('Server error details:', error.response.data);
      }
      setMessage('Failed to update settings. Please try again.');
    }
  };

  return (
    <div className="settings_container">
      <div className="settings_wrapper">
        <div className="settings_header">
          <h1>Account Settings</h1>
        </div>
        {message && <p>{message}</p>}
        <form className="settings_form" onSubmit={handleSubmit}>
          <div className="form_group">
            <label>Username</label>
            <input
              type="text"
              className="form_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form_group">
            <label>New Password</label>
            <input
              type="password"
              className="form_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>
          <div className="form_group">
            <label>Profile Picture</label>
            <input
              type="file"
              className="form_input"
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className="profile_preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" />
              ) : (
                <User className="profile_icon" />
              )}
            </div>
          </div>
          <button type="submit" className="form_button">
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
