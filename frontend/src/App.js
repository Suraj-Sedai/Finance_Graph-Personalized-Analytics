import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import AddTransactionForm from './components/AddTransactionForm';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you have a ProtectedRoute component
import TransactionList from './components/TransactionList';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LoginForm />} />
                
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

            </Routes>
        </Router>
    );
};

export default App;