from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile

@receiver(post_save, sender=User )
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a Profile instance when a User instance is created
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User )
def save_user_profile(sender, instance, **kwargs):
    # Save the associated Profile instance when the User instance is saved
    instance.profile.save()