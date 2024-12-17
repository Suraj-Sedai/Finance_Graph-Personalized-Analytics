import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import AddTransactionForm from './components/AddTransactionForm';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you have a ProtectedRoute component
import TransactionList from './components/TransactionList';
import SignupForm from './components/SignupForm';
import FinancialAnalytics from './components/FinancialAnalytics'; // Import new component

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />

                {/* Protected route for HomePage */}
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/add-transaction" element={<AddTransactionForm />} />
                <Route path="/transactions" element={<TransactionList />} />
                
                {/* New route for Financial Analytics */}
                <Route 
                    path="/financial-analytics" 
                    element={
                        <ProtectedRoute>
                            <FinancialAnalytics />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
