import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FinancialAnalytics from './FinancialAnalytics';

const HomePage = () => {
    const navigate = useNavigate();
    const [isLogoutVisible, setLogoutVisible] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const toggleLogoutVisibility = () => {
        setLogoutVisible(!isLogoutVisible);
    };

    const downloadFile = (format) => {
        const url = `http://127.0.0.1:8000/api/export/${format}/`;

        axios({
            url: url,
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
        })
        .then((response) => {
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = `financial_data.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch((error) => {
            console.error(`Error downloading ${format} file:`, error);
            alert(`Failed to download ${format} file.`);
        });
    };

    return (
        <div>
            <section className='home_page'>
                <h1>Welcome to the Finance Management System</h1>
                <div className={`user ${isLogoutVisible ? 'active' : ''}`} onClick={toggleLogoutVisibility}>
                    <span className="material-symbols-outlined">account_circle</span>
                    <p>{username}</p>
                    {isLogoutVisible && <button className='logout' onClick={handleLogout}>Logout</button>}
                </div>

                <div className='nav'>
                    <Link to="/add-transaction">
                        <button className='nav_btn'>Add Transaction</button>
                    </Link>
                    <Link to="/transactions">
                        <button className='nav_btn'>View All Transactions</button>
                    </Link>
                </div>
            </section>

            <section className='sec_page'>
                <div className="analytics-and-chart">
                    <div className="financial-analytics-container">
                        <FinancialAnalytics />
                    </div>
                </div>

                {/* Extract Data Buttons */}
                <div className="export-buttons">
                    <h2>Download Your Financial Data</h2>
                    <button className="export-btn" onClick={() => downloadFile('csv')}>Download CSV</button>
                    <button className="export-btn" onClick={() => downloadFile('json')}>Download JSON</button>
                    <button className="export-btn" onClick={() => downloadFile('pdf')}>Download PDF</button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
