import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Download } from "lucide-react";
import { Chart } from "chart.js/auto";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to hold the fetched financial data
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the logged-in user's financial data from the backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/financial-data/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFinancialData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching financial data:", error);
        setLoading(false);
      });
  }, [token]);

  // Function to download files (PDF, CSV, JSON, etc.) using the export endpoint
  const downloadFile = (format) => {
    const url = `http://127.0.0.1:8000/api/export/${format.toLowerCase()}/`;

    axios({
      url: url,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
      .then((response) => {
        const file = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(file);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!financialData) {
    return <div>Error loading financial data.</div>;
  }

  // Prepare spending data for the CategoryList and PieChart components.
  // The API returns categories with a property "total_amount" which we map to "amount".
  const spendingData = financialData.categories.map((cat) => ({
    category: cat.category,
    amount: cat.total_amount,
  }));

  return (
    <div className="dashboard-wrapper">
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Metrics Section */}
        <section className="metrics">
          <Card
            title="Total Spending"
            value={`$${financialData.total_spending}`}
          />
          <Card
            title="Average Spending"
            value={`$${financialData.average_spending}`}
          />
          <Card
            title="Total Transactions"
            value={`${financialData.total_transitions}`}
          />
        </section>

        {/* Spending Categories & Chart */}
        <section className="spending-section">
          <CategoryList data={spendingData} />
          <monthList data={spendingData} />
          <ChartCard data={spendingData} />
        </section>

        {/* Download Section */}
        <section className="download-section">
          <h2>Download Your Financial Data</h2>
          <div className="download-buttons">
            <DownloadButton
              format="PDF"
              onClick={() => downloadFile("PDF")}
            />
            <DownloadButton
              format="CSV"
              onClick={() => downloadFile("CSV")}
            />
            <DownloadButton
              format="JSON"
              onClick={() => downloadFile("JSON")}
            />
          </div>
        </section>
      </main>
    </div>
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
            <span className="category-amount">
              ${item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

//component to disply spending by months
function MonthList({ data }) {
  return (
    <div className="card category-card">
      <h3>Spending by Month</h3>
      <div className="category-list">
        {data.map((item) => (
          <div key={item.month} className="spending-item">
            <span className="category-name">{item.month}</span>
            <span className="category-amount">
              ${item.amount.toFixed(2)}
            </span>
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
            position: "top",
            labels: {
              color: "#fff",
              font: { size: 14 },
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
