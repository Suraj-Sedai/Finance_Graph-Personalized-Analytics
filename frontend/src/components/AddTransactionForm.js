import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "Entertainment",
  "Food",
  "Shopping",
  "Bills",
  "Travel",
  "Others",
];

export default function AddData() {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    if (!description || !date || !category || !price) {
      setError("All fields are required.");
      return;
    }
    if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) {
      setError("Price must be a valid number greater than zero.");
      return;
    }

    // Prepare the data for the transaction
    const transactionData = {
      description,
      amount: parseFloat(price), // Backend expects "amount"
      category,
      date, // Ensure this is in the correct format (YYYY-MM-DD)
    };

    console.log("Submitting transaction data:", transactionData);

    // Post the transaction data to the backend
    axios
      .post("http://127.0.0.1:8000/api/transactions/", transactionData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Transaction added successfully!");
        // Reset the form fields
        setDescription("");
        setDate("");
        setCategory(categories[0]);
        setPrice("");
        setError("");
        // Optionally, navigate back to the dashboard or another page
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error response:", error.response);
        // Log the complete error data to see what the backend is returning
        console.error("Backend error data:", error.response?.data);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
        } else {
          setError(
            error.response?.data?.detail ||
              "Failed to add transaction. Check console for details."
          );
        }
      });
  };

  return (
    <div className="add-data-container">
      <div className="add-data-wrapper">
        <header className="add-data-header">
          <Link to="/home" className="back-button">
            <ArrowLeft className="icon" />
            Back to Dashboard
          </Link>
          <h1>Add Data</h1>
        </header>
        {error && <p className="error-message">{error}</p>}
        <form className="add-data-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              step="0.01"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Add Data
          </button>
        </form>
      </div>
    </div>
  );
}
