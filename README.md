Finance Management Application
This project is a finance management application that allows users to track their financial transactions, view spending analytics, and manage their personal finance data. It includes functionality for tracking transactions, calculating total and average spending, visualizing spending by category with pie charts, and managing user authentication via JWT tokens.

Features
User Registration & Authentication: Users can register and log in with a username and password.
Transaction Management: Users can add, view, update, and delete financial transactions.
Financial Analytics: View total and average spending, as well as a breakdown of spending by category.
Visualization: Pie chart generation to visualize spending by category.
Responsive UI: The frontend is designed to be responsive and user-friendly, offering smooth interaction across various devices.
Tech Stack
Backend: Django (REST Framework), NumPy
Frontend: React, Axios
Visualization: Matplotlib (for pie chart generation)
Authentication: JWT (JSON Web Token)
Database: SQLite (or PostgreSQL/MySQL in production)
Project Structure
1. Backend (Django)
Transaction Model: Stores details of each financial transaction (amount, description, category, etc.).
Views:
FinancialDataView: Returns total spending, average spending, and spending breakdown by category.
Category Spending Pie Chart: Generates a pie chart for spending visualization.
RegisterView: Allows users to register an account.
TransactionView: Handles creating and viewing transactions.
TransactionViewSet: Provides CRUD operations for transactions.
JWT Authentication: Secure API endpoints using JWT tokens.
2. Frontend (React + Axios)
Axios Instance: Handles HTTP requests with automatic JWT token management.
Login & Registration: Users can log in and register using their credentials. A JWT token is stored in localStorage for session management.
Transaction Pages: Pages for viewing, adding, and managing transactions.
Responsive UI: The app adapts to different screen sizes (mobile and desktop).
Setup Instructions
Prerequisites
Python 3.x
Node.js
npm or yarn
Backend Setup (Django)
Clone the repository:


git clone <repository-url>
cd <repository-name>/backend
Install the required Python dependencies:


pip install -r requirements.txt
Apply the database migrations:


python manage.py migrate
Create a superuser for the Django admin (optional):


python manage.py createsuperuser
Start the Django development server:


python manage.py runserver
The backend will be running at http://127.0.0.1:8000.

Frontend Setup (React)
Navigate to the frontend directory:


cd <repository-name>/frontend
Install the required npm dependencies:

npm install
Start the React development server:

npm start
The frontend will be running at http://localhost:3000.

API Endpoints
1. Authentication
POST /api/token/: Get JWT token (login)

Request body:
json
Copy code
{
  "username": "user",
  "password": "password"
}
POST /api/register/: Register a new user

Request body:
json
Copy code
{
  "username": "newuser",
  "password": "newpassword"
}
2. Transactions
GET /api/transactions/: List all transactions for the authenticated user.

POST /api/transactions/: Create a new transaction.

Request body:
json
Copy code
{
  "description": "Lunch",
  "amount": 15.50,
  "category": "Food"
}
GET /api/transactions/{id}/: View a specific transaction.

PUT /api/transactions/{id}/: Update an existing transaction.

DELETE /api/transactions/{id}/: Delete a transaction.

3. Financial Analytics
GET /api/financial-data/: Get total and average spending, as well as spending by category.
4. Pie Chart Generation
GET /api/category-spending-pie-chart/: Generates a pie chart for spending by category.
Frontend Usage
Login: The login page allows users to enter their credentials (username, password). Upon successful login, a JWT token is stored in localStorage and sent with each API request.

Register: New users can register using the RegisterView endpoint by providing a username and password.

Transaction Management:

Users can add new transactions by filling out a form with the transaction description, amount, and category.
Existing transactions can be viewed, updated, or deleted from the transaction list page.
Financial Analytics: View your total and average spending, as well as a pie chart breakdown of spending by category.

Error Handling
401 Unauthorized: If the JWT token is expired or invalid, users are logged out automatically, and they are redirected to the login page.
Form Errors: Validation errors are displayed on the frontend with helpful messages.
Conclusion
This project serves as a full-stack personal finance management application, offering secure user authentication, transaction management, financial analytics, and visualizations to help users better understand their spending habits.

Feel free to contribute to the project or suggest improvements!


