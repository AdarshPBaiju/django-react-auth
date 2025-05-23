from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    
    def ready(self):
        # Import the signals module to ensure registration
        from . import signals
