from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
import numpy as np
import matplotlib.pyplot as plt
import io 
from django.http import HttpResponse
from .models import Transaction
from django.db.models import Sum
import matplotlib.pyplot as plt
import io
import base64
from .models import Transaction
from collections import defaultdict
from django.http import HttpResponse
from collections import defaultdict
from .models import Transaction
import matplotlib.pyplot as plt
import io
# Endpoint to get financial data (total spending, average spending)
class FinancialDataView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        # Fetch all transactions for the logged-in user
        user_transactions = Transaction.objects.filter(user=request.user)

        # Use NumPy to calculate the total and average spending
        amounts = np.array([transaction.amount for transaction in user_transactions])

        total_spending = np.sum(amounts)  # Total spending
        average_spending = np.mean(amounts)  # Average spending

        # Spending by category
        categories = user_transactions.values('category').annotate(total_amount=Sum('amount'))

        # Prepare the response data
        data = {
            'total_spending': total_spending,
            'average_spending': average_spending,
            'categories': [{'category': cat['category'], 'total_amount': cat['total_amount']} for cat in categories],
        }

        return Response(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_spending_pie_chart(request):
    transactions = Transaction.objects.filter(user=request.user)

    # Summing the amounts by category
    category_data = defaultdict(float)
    for transaction in transactions:
        category_data[transaction.category] += transaction.amount

    categories = list(category_data.keys())
    amounts = list(category_data.values())

    # Plot pie chart
    fig, ax = plt.subplots()
    ax.pie(amounts, labels=categories, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  # Equal aspect ratio ensures that pie chart is circular.

    # Save the plot to a PNG image in memory
    image_stream = io.BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)

    # Return the image as a direct response
    return HttpResponse(image_stream, content_type='image/png')


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
        user = User.objects.create_user(username=username, password=password)
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
def add_transaction(request):
    if request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Save transaction with the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()  # Ensure this is defined
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)  # Only show user's transactions

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save with authenticated user
    