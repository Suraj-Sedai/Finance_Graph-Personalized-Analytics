# 🚀 Finance Management Web Application

## 📌 Overview
Take control of your personal finances with our powerful web application! Track transactions, analyze spending, and gain financial insights with dynamic charts and data export capabilities.

## 🎯 Key Features
- ✅ Secure User Authentication - Register, log in, and manage accounts with JWT authentication.
- ✅ Transaction Management - Easily add, view, and delete financial transactions.
- ✅ Powerful Analytics - Get insights into total spending, average spending, and spending by category.
- ✅ Interactive Data Visualization - View financial breakdowns with dynamic pie charts and reports.
- ✅ Fully Responsive - Enjoy a seamless experience across mobile and desktop devices.
- ✅ Data Export - Download financial reports in CSV, JSON, or PDF formats.
- ✅ Profile Customization - Upload and manage profile pictures for a personalized experience.

## 🛠️ Tech Stack
🎯 Backend:
- Django - Robust backend framework
- Django REST Framework - API management
- NumPy & Pandas - Financial data analytics
- Matplotlib - Data visualization
- PostgreSQL - Scalable production database

🎨 Frontend:
- React - Fast and interactive UI
- Axios - API communication
- Chart.js - Financial data visualization
- React Router - Seamless navigation

## 🚀 Getting Started
### ✅ Prerequisites:
- Python (3.x)
- Node.js & npm
- PostgreSQL (for production)

### 🏗 Backend Setup:
```bash
# Clone the repository
git clone <https://github.com/Suraj-Sedai/Finance_Graph-Personalized-Analytics>

# Navigate to the backend
cd backend/

# Set up a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

### 🎨 Frontend Setup:
```bash
# Navigate to the frontend
cd frontend/

# Install dependencies
npm install

# Start the frontend server
npm start
```

## ⚙️ Configuration:
```bash
# API Configuration: Update API_BASE_URL in frontend/src/api.js to match your backend URL.
# JWT Handling: Store authentication tokens in localStorage for seamless authentication.
```

## 🔗 API Endpoints:
```bash
# 🔐 Authentication:
POST /api/register/ - User registration
POST /api/token/ - Obtain JWT token

# 💰 Transactions:
GET /api/transactions/ - Retrieve user transactions
POST /api/transactions/ - Add a new transaction

# 📊 Analytics & Export:
GET /api/financial-data/ - Fetch financial summaries
GET /api/category-spending-pie-chart/ - View spending by category
GET /api/export/csv/ - Export transactions in CSV
GET /api/export/json/ - Export transactions in JSON
GET /api/export/pdf/ - Export transactions in PDF
```

## 🎨 Frontend Features:
```bash
# 💡 Dashboard - View financial analytics and interactive charts.
# 📄 Transaction List - Manage your financial transactions efficiently.
# 📤 Download Reports - Export financial data in multiple formats.
# 🛠 Profile Management - Customize your user experience with profile settings and picture upload.
# ⚡ Error Handling - Get proper error messages for API failures.
```

## 🚀 Future Enhancements:
```bash
# 🔹 Multi-User Support - Shared finance tracking for families or teams.
# 🔹 Advanced Reports - Monthly/yearly spending insights.
# 🔹 Cloud Integration - Store reports securely using AWS S3.
# 🔹 AI-Powered Insights - Predictive analytics to manage spending efficiently.
```

## 📜 License
```bash
# This project is licensed under the MIT License - see the LICENSE file for details.
```

## 🤝 Contribution
```bash
# Contributions are welcome! Feel free to open an issue or submit a pull request.
```

## 📞 Support
```bash
# For any queries or support, contact Suraj Sedai at <surajsedai05@gmail.com>
```

