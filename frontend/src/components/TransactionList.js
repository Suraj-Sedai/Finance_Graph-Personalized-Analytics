import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ViewAll() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTransactions();
  }, [token, navigate]);

  const fetchTransactions = () => {
    axios
      .get("http://127.0.0.1:8000/api/transactions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
        setLoading(false);
      });
  };

  const deleteTransaction = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/transactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Remove the deleted transaction from the state.
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting transaction:", err);
        alert("Failed to delete transaction. Please try again.");
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
    <div className="viewall-container">
      <div className="viewall-wrapper">
        <header className="viewall-header">
          <Link to="/home" className="back-button">
            <ArrowLeft className="icon" />
            Back to Dashboard
          </Link>
          <h1>View All Spendings</h1>
        </header>
        <div className="spending-table-container">
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions available.</p>
          ) : (
            <table className="spending-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    {/* Display only the date part by splitting at "T" */}
                    <td>{transaction.date.split("T")[0]}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>{Number(transaction.amount).toFixed(2)}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
