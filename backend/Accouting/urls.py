from django.urls import path
from . import views

urlpatterns = [

    path('transactions/', views.add_transaction, name='add_transaction'),

]
