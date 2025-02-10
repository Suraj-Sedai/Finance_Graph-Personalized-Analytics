from django.apps import AppConfig

class AccountingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Accouting'  # Ensure this matches the app folder name
    def ready(self):
        import Accouting.signals