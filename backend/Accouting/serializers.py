from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # To show the username of the owner

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'date', 'category']
