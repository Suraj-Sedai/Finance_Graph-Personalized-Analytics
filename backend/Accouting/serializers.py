from rest_framework import serializers
from .models import Transaction
from django.core.exceptions import ValidationError

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'category', 'user', 'date']

    def validate(self, data):
        # Perform model-level validation (via the clean() method)
        transaction = Transaction(**data)
        try:
            transaction.clean()  # Calls the clean method of the model
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)  # Raise serializer error if validation fails
        return data

    def create(self, validated_data):
        # Automatically set the user when creating a new transaction
        user = self.context['request'].user  # Get user from request context
        validated_data['user'] = user
        return Transaction.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Ensure the user can't be updated; keep the existing user
        validated_data['user'] = instance.user  # Ensure user remains the same
        return super().update(instance, validated_data)
