Finance Management Web Application

This is a comprehensive web application for managing personal finances, tracking transactions, calculating spending, and generating financial analytics, including visual representations like pie charts. The application is built using Django (backend) and React (frontend), with integrated features for user authentication, registration, transaction management, and analytics visualization.

Features
---------------------

•	User Authentication: Users can register, log in, and manage their accounts.

•	Transaction Management: Users can add, view, and delete financial transactions.

•	Financial Analytics: Real-time data analytics showing total spending, average spending, and spending by category.

•	Pie Chart Visualization: A dynamic pie chart representing the user’s spending breakdown by category.

•	Responsive Design: The application is fully responsive for both mobile and desktop devices.

•	JWT Authentication: Secure authentication using JSON Web Tokens (JWT) for API requests.


Technologies Used
---------------------

•	Backend: Django, Django REST Framework

•	Frontend: React, Axios

•	Data Analytics: NumPy

•	Data Visualization: Matplotlib (for pie charts)

•	Database: SQLite (for development), can be switched to other databases like PostgreSQL for production


Setup Instructions

Prerequisites


Ensure you have the following installed on your system:
---------------------


•	Python (3.x)

•	Node.js (for React frontend)

•	npm (for managing frontend packages)

•	SQLite (or another preferred database)


Backend Setup
---------------------

1.	Clone the repository:
git clone <https://github.com/Suraj-Sedai/Finance_Graph-Personalized-Analytics>
2.	Navigate to the backend directory:
cd backend/
3.	Create a virtual environment (optional but recommended):
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
4.	Install the required Python packages:
pip install -r requirements.txt
5.	Apply migrations to set up the database:
python manage.py migrate
6.	Create a superuser for accessing the admin panel (optional):
python manage.py createsuperuser
7.	Start the backend server:
python manage.py runserver
Frontend Setup
1.	Navigate to the frontend directory:
cd frontend/
2.	Install the required frontend packages:
npm install
3.	Start the frontend development server:
npm start
Configuration
•	Update the API_BASE_URL in the frontend code (frontend/src/api.js) to point to the backend server if not running locally.
•	Set up JWT token handling and store it in localStorage for user authentication.
API Endpoints
•	POST /api/register/: User registration endpoint.
•	POST /api/token/: Obtain a JWT token for authentication.
•	GET /api/transactions/: Retrieve all transactions for the authenticated user.
•	POST /api/transactions/: Add a new transaction for the authenticated user.
•	GET /api/financial-data/: Fetch total spending, average spending, and spending by category for the authenticated user.
•	GET /api/category-spending-pie-chart/: Generate a pie chart showing spending by category.
Frontend Details
•	Login & Signup Forms: User-friendly forms to handle login and registration.
•	Dashboard: Displays financial data (total, average, and category-wise spending) along with a pie chart visualization.
•	Transaction List: Allows users to view, add, and manage their transactions.
•	Responsive Design: The UI adapts to different screen sizes for a smooth experience across devices.
Error Handling
•	All API responses include relevant status codes to indicate success or failure.
•	JWT token expiration (401 Unauthorized) results in automatic logout and redirection to the login page.
Future Improvements
•	Multi-user support: Adding support for multiple users in a single application.
•	Advanced Analytics: Introduce more detailed financial reports (e.g., monthly/yearly analysis).
•	Cloud Database: Use a cloud database like PostgreSQL or MySQL for production environments.
•	User Profile: Enhance the user profile section with additional settings and preferences.
