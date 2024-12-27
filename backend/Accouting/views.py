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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_spending_pie_chart(request):
    # Query all transactions for the authenticated user
    transactions = Transaction.objects.filter(user=request.user)

    # Aggregate spending by category directly in the database
    category_data = (
        transactions.values('category')
        .annotate(total_amount=Sum('amount'))
        .order_by('category')
    )

    # If no data exists, return an appropriate message
    if not category_data:
        return Response({"message": "No data available to create the pie chart."}, status=status.HTTP_200_OK)

    # Extract category names and total amounts
    categories = [entry['category'] for entry in category_data]
    amounts = [entry['total_amount'] for entry in category_data]

    try:
        # Plot pie chart
        fig, ax = plt.subplots(figsize=(6, 4))  # Set the figure size
        ax.pie(amounts, labels=categories, autopct='%1.1f%%', startangle=90, colors=['#ff9999','#66b3ff','#99ff99','#ffcc99','#c2c2f0'])
        ax.axis('equal')  # Equal aspect ratio ensures that pie chart is circular.

        # Save the plot to an image in memory
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)

        # Close the plot to free up memory
        plt.close(fig)

        # Return the image as a response
        return HttpResponse(buffer, content_type='image/png')
    
    except Exception as e:
        # Handle errors in generating the chart
        return Response({"error": f"An error occurred while generating the chart: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)  # Fetch only user's data
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Save the transaction with the current user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # Save transaction with the authenticated user
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)  # Only show user's transactions

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save with authenticated user
