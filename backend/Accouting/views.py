from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Sum
from django.http import HttpResponse
from collections import defaultdict
import numpy as np
import matplotlib.pyplot as plt
import io
from .models import Transaction
from .serializers import TransactionSerializer
from .utils import PieChartGenerator  # Import the utility class
import logging

# Set up logger
logger = logging.getLogger(__name__)

# Define a simple homepage view
def home(request):
    return HttpResponse("Welcome to the Finance Management API!")

# Endpoint to get financial data (total spending, average spending)
class FinancialDataView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user_transactions = Transaction.objects.filter(user=request.user)

        # Use NumPy to calculate the total and average spending
        amounts = np.array([float(transaction.amount) for transaction in user_transactions])  # Convert to float

        total_spending = np.sum(amounts) if len(amounts) > 0 else 0  # Total spending
        average_spending = np.mean(amounts) if len(amounts) > 0 else 0  # Average spending

        # Spending by category
        categories = user_transactions.values('category').annotate(total_amount=Sum('amount'))

        # Prepare the response data
        data = {
            'total_spending': total_spending,
            'average_spending': average_spending,
            'categories': [
                {'category': cat['category'], 'total_amount': cat['total_amount']} for cat in categories
            ],
        }

        return Response(data)

# View for generating spending by category pie chart
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_spending_pie_chart(request):
    transactions = Transaction.objects.filter(user=request.user)
    category_data = (
        transactions.values('category')
        .annotate(total_amount=Sum('amount'))
        .order_by('category')
    )

    if not category_data:
        return Response({"message": "No data available to create the pie chart."}, status=status.HTTP_204_NO_CONTENT)

    categories = [entry['category'] for entry in category_data]
    amounts = [entry['total_amount'] for entry in category_data]

    try:
        # Use PieChartGenerator to create the pie chart
        buffer = PieChartGenerator.create_pie_chart(categories, amounts, title="Your Spending by Category")

        # Return the image as an HTTP response
        return HttpResponse(buffer, content_type='image/png')
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error generating pie chart: {str(e)}")  # Log the error
        return Response({"error": f"An error occurred while generating the chart: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Register user endpoint
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)

# Transaction view for handling GET and POST requests (single view for transactions)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        transaction_data = request.data
        transaction_data['user'] = request.user.id
        serializer = TransactionSerializer(data=transaction_data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Transaction added successfully!", "transaction": serializer.data}, status=201)
        return Response(serializer.errors, status=400)


# Transaction viewset (optional, can be used for more complex CRUD functionality)
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)  # Only show user's transactions

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save with authenticated user
