from django.shortcuts import render, redirect
from .forms import IncomeForm
from .forms import ExpenseForm
from .models import Income, Expense
from django.db.models import Sum
from rest_framework import viewsets
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction  # Import your model
from .serializers import TransactionSerializer  # Import your serializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Create a new transaction
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assuming the user is attached to the transaction
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_transaction(request):
    if request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)  # Save with the user from the JWT token
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

def balance(request):
    # Calculate the total income from the Income model using the aggregate() method
    total_income = Income.objects.aggregate(Sum('amount'))['amount__sum'] or 0

    # Calculate the total expenses from the Expense model using the aggregate() method
    total_expenses = Expense.objects.aggregate(Sum('amount'))['amount__sum'] or 0

    # Calculate the balance by subtracting the total expenses from the total income
    balance = total_income - total_expenses

    # Render the balance.html template with the balance as a context variable
    return render(request, 'balance.html', {'balance': balance})

def expense_list(request):
    expenses = Expense.objects.all()
    return render(request, 'expenses/expense_list.html', {'expenses': expenses})

def add_expense(request):
    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('expense_list')
    else:
        form = ExpenseForm()
    return render(request, 'expenses/add_expense.html', {'form': form})

def income_list(request):
    incomes = Income.objects.all()
    return render(request, 'income/income_list.html', {'incomes': incomes})

def add_income(request):
    if request.method == 'POST':
        form = IncomeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('income_list')
    else:
        form = IncomeForm()
    return render(request, 'income/add_income.html', {'form': form})