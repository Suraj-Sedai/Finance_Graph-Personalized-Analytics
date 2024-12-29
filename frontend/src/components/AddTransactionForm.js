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

        if (amount <= 0 || isNaN(amount)) {  // Additional check for NaN
            setError('Amount must be a valid number greater than zero.');
            return;
        }

        const transactionData = {
            description,
            amount: parseFloat(amount),  // Convert to number
            category,
            date,
        };

        console.log("Sending transaction data:", transactionData);  // Debugging log

        axios
            .post('http://127.0.0.1:8000/api/transactions/', transactionData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert('Transaction added successfully!');
                setDescription('');
                setAmount('');
                setCategory('');
                setDate('');
                setError('');
            })
            .catch((error) => {
                console.log("Error response:", error.response);  // Log the error response for debugging
                if (error.response?.status === 401) {
                    alert('Session expired. Please log in again.');
                    localStorage.clear();
                    navigate('/login');
                } else {
                    setError(error.response?.data?.detail || 'Failed to add transaction.');
                }
            });
    };

    return (
        <div className="transaction_container">
            <button className="back_button" onClick={() => navigate('/home')}>
                <span className="material-symbols-outlined">arrow_back_2</span> Back
            </button>
            <div className="user_info">
                <span className="material-symbols-outlined user_icon">account_circle</span>
                <p>{username}</p>
            </div>
            <div className="transaction_form_wrapper">
                {error && <p className="error_message">{error}</p>}
                <form className="transaction_form" onSubmit={handleSubmit}>
                    <h2 className="form_heading">Add a New Transaction</h2>
                    <input
                        className="form_input"
                        placeholder="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        className="form_input"
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <select
                        className="form_select"
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
                    <input
                        className="form_input"
                        placeholder="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button className="form_button" type="submit">
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
