from django.urls import path
from . import views
from .views import RegisterView, TransactionView, FinancialDataView, category_spending_pie_chart, export_financial_data
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # User registration endpoint
    path('api/register/', RegisterView.as_view(), name='register'),
    
    # Token authentication (login) endpoint
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # Token authentication view
    
    # Transactions endpoints
    path('api/transactions/', TransactionView.as_view(), name='transaction-list'),  # For GET and POST transactions
    
    # Financial data endpoint
    path('api/financial-data/', FinancialDataView.as_view(), name='financial-data'),  # New endpoint for financial data
    
    # Pie chart for category spending
    path('api/pie-chart/', category_spending_pie_chart, name='category_spending_pie_chart'),  # Pie chart endpoint
    
    path('api/export/<str:format_type>/', export_financial_data, name='export_financial_data'),
]