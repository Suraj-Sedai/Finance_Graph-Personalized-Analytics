from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food'),
        ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'),
        ('others', 'Others'),
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
