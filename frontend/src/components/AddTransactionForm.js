// src/components/AddTransactionForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddTransactionForm = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');  // State for category
    const [date, setDate] = useState('');  // State for date
    const [categories, setCategories] = useState(['Food', 'Entertainment', 'Bills', 'Travel']);  // Example categories
    const [error, setError] = useState('');
    const navigate = useNavigate();  // For navigation
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!description || !amount || !category || !date) {
            setError('All fields are required');
            return;
        }

        const transactionData = {
            description,
            amount,
            category,
            date,  // Include date in the transaction data
        };

        // Send data to the API
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
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to add transaction.');
            });
    };

    return (
        <div>
                <button onClick={() => navigate('/home')}>
                <span class="material-symbols-outlined">arrow_bacK</span> Back
                </button>
                <div className='user'>
                    <span class="material-symbols-outlined">
                        account_circle
                        </span>
                    <p>{username}</p>
                </div>
            <div className="add-transaction-form">

                {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message if any */}

                <form onSubmit={handleSubmit}>
                    <h2 className='heading2'>Add a New Transaction</h2>
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
                            placeholder='Date'
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button className='login' type="submit">Add Transaction</button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
