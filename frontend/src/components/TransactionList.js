// src/components/TransactionList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const token = localStorage.getItem('token');
    const navigate = useNavigate();  // For navigation

    useEffect(() => {
        if (!token) {
            navigate('/login');  // Redirect to login if no token
            return;
        }

        axios
            .get('http://127.0.0.1:8000/api/transactions/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTransactions(response.data);
                setLoading(false);  // Set loading to false once data is fetched
            })
            .catch((error) => {
                setError('Failed to load transactions. Please try again later.');
                setLoading(false);
            });
    }, [token, navigate]);

    if (loading) {
        return <div>Loading transactions...</div>;  // Show loading message
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if any error occurs
    }

    return (
        <div className="transaction-list">
            <button onClick={() => navigate('/home')}>Back</button>
            <h2>Transaction List</h2>
            {transactions.length === 0 ? (
                <p>No transactions available.</p>  // Handle empty transactions
            ) : (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            <strong>{transaction.description}</strong><br />
                            {transaction.amount} - {transaction.category}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionList;
