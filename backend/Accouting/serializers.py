from rest_framework import serializers
from .models import Transaction
from django.core.exceptions import ValidationError
# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSettingsSerializer(serializers.ModelSerializer):
    # Use a SerializerMethodField to return the picture URL (or default if not set)
    profile_picture = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'profile_picture')

    def get_profile_picture(self, obj):
        try:
            pic = obj.profile.profile_picture
            if pic and hasattr(pic, "url"):
                return pic.url
            else:
                # Return a default image URL – make sure this file exists in your static files
                return "/static/images/default_profile.jpg"
        except Exception:
            return "/static/images/default_profile.jpg"

    def update(self, instance, validated_data):
        # Update username
        instance.username = validated_data.get('username', instance.username)

        # Update password if provided
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()

        # Handle profile picture update
        profile_data = validated_data.get('profile', {})
        profile_picture = profile_data.get('profile_picture', None)
        # Use get_or_create to ensure a Profile exists
        profile, created = Profile.objects.get_or_create(user=instance)
        if profile_picture:
            profile.profile_picture = profile_picture
            profile.save()
        return instance

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
