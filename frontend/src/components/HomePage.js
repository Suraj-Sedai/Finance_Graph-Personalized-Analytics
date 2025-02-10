import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, Plus, Grid, Settings, Download, LogOut } from "lucide-react";
import { Chart } from "chart.js/auto";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Function to download files (PDF, CSV, JSON, etc.)
  const downloadFile = (format) => {
    // Ensure the format string is lowercase for the URL
    const url = `http://127.0.0.1:8000/api/export/${format.toLowerCase()}/`;

    axios({
      url: url,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
      .then((response) => {
        // Create a new Blob object using the response data
        const file = new Blob([response.data], { type: response.headers["content-type"] });
        const fileURL = URL.createObjectURL(file);

        // Create a temporary link and trigger the download
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `financial_data.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error(`Error downloading ${format} file:`, error);
        alert(`Failed to download ${format} file.`);
      });
  };

  // Logout function: clear localStorage and navigate back to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/"); // Adjust the route if needed
  };

  // Sample spending data (replace with dynamic data as needed)
  const spendingData = [
    { category: "Entertainment", amount: 714.25 },
    { category: "Food", amount: 104.04 },
    { category: "Shopping", amount: 917.55 },
    { category: "Bills", amount: 523.97 },
    { category: "Travel", amount: 312.85 },
    { category: "Others", amount: 14.27 },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-wrapper">
        <Header username={username} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="main-content">
          <h1 className="dashboard-title">Dashboard</h1>

          {/* Metrics Section */}
          <section className="metrics">
            <Card title="Total Spending" value="$4128.98" />
            <Card title="Average Spending" value="$687.54" />
          </section>

          {/* Spending Categories & Chart */}
          <section className="spending-section">
            <CategoryList data={spendingData} />
            <ChartCard data={spendingData} />
          </section>

          {/* Download Section */}
          <section className="download-section">
            <h2>Download Your Financial Data</h2>
            <div className="download-buttons">
              <DownloadButton format="PDF" onClick={() => downloadFile("PDF")} />
              <DownloadButton format="CSV" onClick={() => downloadFile("CSV")} />
              <DownloadButton format="JSON" onClick={() => downloadFile("JSON")} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Sidebar Component with Navigation Links
function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarButton Icon={Home} text="Dashboard" to="/dashboard" />
      <SidebarButton Icon={Plus} text="Add Transaction" to="/add-transaction" />
      <SidebarButton Icon={Grid} text="Transactions" to="/transactions" />
      <SidebarButton Icon={Settings} text="Settings" to="/settings" />
    </aside>
  );
}

// Sidebar Button Component (wraps a button with an optional Link)
function SidebarButton({ Icon, text, to }) {
  const buttonContent = (
    <button className="sidebar-button">
      <Icon className="icon" />
      <span className="sidebar-text">{text}</span>
    </button>
  );
  return to ? <Link to={to}>{buttonContent}</Link> : buttonContent;
}

// Header Component for displaying user info and logout button
function Header({ username, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="user-info">
        <span className="material-symbols-outlined">account_circle</span>
        <p>{username}</p>
      </div>
      <button className="logout-button" onClick={onLogout}>
        <LogOut className="icon" />
        Logout
      </button>
    </header>
  );
}

// Card Component for displaying metrics
function Card({ title, value }) {
  return (
    <div className="card metric-card">
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  );
}

// Component to list spending by category
function CategoryList({ data }) {
  return (
    <div className="card category-card">
      <h3>Spending by Category</h3>
      <div className="category-list">
        {data.map((item) => (
          <div key={item.category} className="spending-item">
            <span className="category-name">{item.category}</span>
            <span className="category-amount">${item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Card Component wrapping the Pie Chart
function ChartCard({ data }) {
  return (
    <div className="card chart-card">
      <PieChart data={data} />
    </div>
  );
}

// Pie Chart Component using Chart.js
function PieChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy any previous chart instance to avoid duplicates
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((item) => item.category),
        datasets: [
          {
            data: data.map((item) => item.amount),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
            borderColor: "#222",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });

    // Cleanup the chart instance on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}

// Download Button Component
function DownloadButton({ format, onClick }) {
  return (
    <button className="download-button" onClick={onClick}>
      <Download className="icon" />
      <span>{format}</span>
    </button>
  );
}
