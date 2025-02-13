import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HomePage from './components/HomePage';
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';
import FinancialAnalytics from './components/FinancialAnalytics';
import SettingsPage from './components/SettingsPage';  // New Settings page component
import ProtectedRoute from './components/ProtectedRoute'; // Your authentication wrapper
import Layout from './components/Layout'; // Import the layout
import "./styles.css";  // Import your CSS file

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes wrapped in Layout */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/add-transaction" 
          element={
            <ProtectedRoute>
              <Layout>
                <AddTransactionForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Layout>
                <TransactionList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/financial-analytics" 
          element={
            <ProtectedRoute>
              <Layout>
                <FinancialAnalytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
