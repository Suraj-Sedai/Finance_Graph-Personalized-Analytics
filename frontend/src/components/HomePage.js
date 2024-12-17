import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FinancialAnalytics from './FinancialAnalytics'; // Import FinancialAnalytics component

const HomePage = () => {
    const navigate = useNavigate();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLogoutVisible, setLogoutVisible] = useState(false);  // State to control logout visibility
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');  // Redirect to login page
    };

    const toggleLogoutVisibility = () => {
        setLogoutVisible(!isLogoutVisible);  // Toggle logout button visibility
    };

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                if (token) {
                    const response = await axios.get('http://127.0.0.1:8000/api/transactions/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRecentTransactions(response.data.slice(0, 5));  // Fetch only the first 5 transactions
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, [token]);

    return (
        <div>
            <section className='home_page'>
                <h1>Welcome to the Finance Management System</h1>
                <div className={`user ${isLogoutVisible ? 'active' : ''}`} onClick={toggleLogoutVisibility}>
                    <span className="material-symbols-outlined">
                        account_circle
                    </span>
                    <p>{username}</p>
                    {isLogoutVisible && (
                        <button className='logout' onClick={handleLogout}>Logout</button>
                    )}
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
                <div className='trans'>
                    <h2>Recent Transactions</h2>
                    {recentTransactions.length > 0 ? (
                        <ul>
                            {recentTransactions.map((transaction) => (
                                <li key={transaction.id}>
                                    {transaction.description} - ${transaction.amount} - {transaction.date}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No recent transactions found.</p>
                    )}
                </div>
                
                {/* Add Financial Analytics Section */}
                <div className="financial-analytics-section">
                    <FinancialAnalytics />
                </div>
            </section>

        </div>
    );
};

export default HomePage;
