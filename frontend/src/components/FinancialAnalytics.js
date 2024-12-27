import React, { useEffect, useState } from 'react';
import axios from 'axios';

// A simple reusable component to display error messages
const ErrorMessage = ({ message }) => {
    return <p className="error">{message}</p>;
};

const FinancialAnalytics = () => {
    const [financialData, setFinancialData] = useState({});
    const [chartData, setChartData] = useState(null);
    const [loadingFinancialData, setLoadingFinancialData] = useState(true);
    const [loadingChartData, setLoadingChartData] = useState(true);
    const [error, setError] = useState({ financial: null, chart: null });

    useEffect(() => {
        // Fetch financial data
        axios
            .get('http://localhost:8000/api/financial-data/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                setFinancialData(response.data);
                setLoadingFinancialData(false);
            })
            .catch(() => {
                setError((prev) => ({ ...prev, financial: 'Unable to fetch financial data.' }));
                setLoadingFinancialData(false);
            });

        // Fetch chart data
        axios
            .get('http://localhost:8000/api/pie-chart/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob', // Get binary data
            })
            .then((response) => {
                const imageUrl = URL.createObjectURL(response.data);
                setChartData(imageUrl);
                setLoadingChartData(false);
            })
            .catch(() => {
                setError((prev) => ({ ...prev, chart: 'Unable to fetch pie chart data.' }));
                setLoadingChartData(false);
            });
    }, []);

    if (loadingFinancialData || loadingChartData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="analytics-and-chart">
            <div className="financial-analytics-container">
                <h1>Finance Analytics</h1>
                {error.financial ? (
                    <ErrorMessage message={error.financial} />
                ) : (
                    <>
                        <h2>Total Spending: ${financialData.total_spending}</h2>
                        <h2>Average Spending: ${financialData.average_spending}</h2>
                        <h2>Spending by Category:</h2>
                        {financialData.categories.length > 0 ? (
                            <ul>
                                {financialData.categories.map((cat, index) => (
                                    <li key={index}>
                                        {cat.category}: ${cat.total_amount}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No spending data available.</p>
                        )}
                    </>
                )}
            </div>

            <div className="pie-chart-container">
                <h3>Your Spending by Category</h3>
                {error.chart ? (
                    <ErrorMessage message={error.chart} />
                ) : chartData ? (
                    <img src={chartData} alt="Category Spending Pie Chart" />
                ) : (
                    <p>Pie chart data not available.</p>
                )}
            </div>
        </div>
    );
};

export default FinancialAnalytics;
