from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
# models.py
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", 
        null=True, 
        blank=True,
        help_text="Upload your profile picture. If empty, a default image is used."
    )

    def __str__(self):
        return f"{self.user.username} Profile"

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Entertainment', 'Entertainment'),
        ('Bills', 'Bills'),
        ('Travel', 'Travel'),
        ('Shopping', 'Shopping'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        db_index=True
    )  # Link to the user
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Ensure the amount is positive
        if self.amount <= 0:
            raise ValidationError('Amount must be greater than zero.')

    def __str__(self):
        return f'{self.description} - {self.amount}'

    class Meta:
        ordering = ['-date']  # Newest transactions appear first
