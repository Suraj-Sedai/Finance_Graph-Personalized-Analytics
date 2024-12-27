import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTransactionForm = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [categories] = useState(['Food', 'Entertainment', 'Bills', 'Travel', 'Shopping']); // Static categories
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description || !amount || !category || !date) {
            setError('All fields are required.');
            return;
        }

        if (amount <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        const transactionData = {
            description,
            amount,
            category,
            date,
        };

        axios
            .post('http://127.0.0.1:8000/api/transactions/', transactionData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                alert('Transaction added successfully!');
                setDescription('');
                setAmount('');
                setCategory('');
                setDate('');
                setError('');
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    alert('Session expired. Please log in again.');
                    localStorage.clear();
                    navigate('/login');
                } else {
                    console.error(error);
                    setError(error.response?.data?.detail || 'Failed to add transaction.');
                }
            });
    };

    return (
        <div>
            <button onClick={() => navigate('/home')}>
                <span className="material-symbols-outlined">arrow_back</span> Back
            </button>
            <div className="user">
                <span className="material-symbols-outlined">account_circle</span>
                <p>{username}</p>
            </div>
            <div className="add-transaction-form">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <h2 className="heading2">Add a New Transaction</h2>
                    <div>
                        <input
                            placeholder="Description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((categoryOption, index) => (
                                <option key={index} value={categoryOption}>
                                    {categoryOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            placeholder="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login" type="submit">
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
