import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }
    
        axios
            .get('http://127.0.0.1:8000/api/transactions/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log('API response:', response.data); // Debug log
                setTransactions(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error('API error:', error); // Debug log
                setError('Failed to load transactions. Please try again later.');
                setLoading(false);
            });
    }, [token, navigate]);

    if (loading) {
        return <div className="loading">Loading transactions...</div>;
    }
    
    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button> {/* Retry button */}
            </div>
        );
    }

    return (
        <div className="transaction-list-container">
                        <button className="back_button" onClick={() => navigate('/home')}>
            <span class="material-symbols-outlined">
arrow_back_2
</span> Back
            </button>
            <h2>Transaction List</h2>
            {transactions.length === 0 ? (
                <p className="no-transactions">No transactions available.</p> // Handle empty transactions
            ) : (
                <ul className="transaction-list">
                    {transactions.map((transaction) => (
                        <li key={transaction.id} className="transaction-item">
                            <strong>{transaction.description}</strong>
                            <br />
                            ${transaction.amount} - {transaction.category}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionList;