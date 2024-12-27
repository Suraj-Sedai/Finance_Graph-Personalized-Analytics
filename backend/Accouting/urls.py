from django.urls import path
from . import views
from .views import RegisterView,TransactionView, FinancialDataView, category_spending_pie_chart
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api-token-auth/', obtain_auth_token),

    path('transactions/', views.add_transaction, name='add_transaction'),
    path('api/transactions/', TransactionView.as_view(), name='transaction-list'),
    path('api/financial-data/', FinancialDataView.as_view(), name='financial-data'),  # New endpoint for financial data
    path('api/category-pie-chart/', category_spending_pie_chart, name='category-pie-chart'),  # New endpoint for pie chart

]

