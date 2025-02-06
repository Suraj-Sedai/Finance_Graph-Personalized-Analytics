import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchTransactions();
    }, [token, navigate]);

    const fetchTransactions = () => {
        axios
            .get('http://127.0.0.1:8000/api/transactions/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Failed to load transactions. Please try again later.');
                setLoading(false);
            });
    };

    const deleteTransaction = (id) => {
        axios
            .delete(`http://127.0.0.1:8000/api/transactions/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setTransactions(transactions.filter((transaction) => transaction.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting transaction:', error);
                alert('Failed to delete transaction. Please try again.');
            });
    };

    if (loading) {
        return <div className="loading">Loading transactions...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="transaction-list-container">
            <button className="back_button" onClick={() => navigate('/home')}>
                <span className="material-symbols-outlined">arrow_back_2</span> Back
            </button>
            <h2>Transaction List</h2>
            {transactions.length === 0 ? (
                <p className="no-transactions">No transactions available.</p>
            ) : (
                <ul className="transaction-list">
                    {transactions.map((transaction) => (
                        <li key={transaction.id} className="transaction-item">
                            <strong>{transaction.description}</strong>
                            <br />
                            ${transaction.amount} - {transaction.category}
                            <button
                                className="delete-button"
                                onClick={() => deleteTransaction(transaction.id)}
                            >
                                🗑 Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionList;
