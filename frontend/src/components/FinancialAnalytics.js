import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinancialAnalytics = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/api/financial-data/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // Ensure you're passing the auth token
            }
        })
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => console.error(error));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className='trans'>
            <h1>Finance Analytics</h1>
            <h2>Total Spending: ${data.total_spending}</h2>
            <h2>Average Spending: ${data.average_spending}</h2>
            <h2>Spending by Category:</h2>
            <ul>
                {data.categories.map((cat, index) => (
                    <li key={index}>{cat.category}: ${cat.total_amount}</li>
                ))}
            </ul>
            </div>
            <h2>Spending by Category (Pie Chart)</h2>
            <img src="http://localhost:8000/api/category-pie-chart/" alt="Category Spending Pie Chart" />
            </div>
    );
};

export default FinancialAnalytics;
