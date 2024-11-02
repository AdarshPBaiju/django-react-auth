import os
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        """Create and return a `User` with an email, username and password."""
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        """Create and return a superuser with the given email, username and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)  # Set is_active to True for superuser
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True, primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=False)
    role = models.CharField(
        max_length=10,
        choices=(
            ('ADMIN', 'Admin'),
            ('USER', 'User'),
        ),
        default='USER'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    objects = UserManager()
    
    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    full_name = models.CharField(max_length=300)    
    bio = models.CharField(max_length=500)
    image = models.ImageField(default='default.jpg', upload_to='user_images')
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name
    

class VideoFile(models.Model):
    video = models.FileField(upload_to='videos')
    subtitle = models.FileField(upload_to='subtitles', null=True, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnail', null=True, blank=True)
    title = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Check if this is an update and delete old files if necessary
        if self.pk:  # The object already exists in the database
            old_video = VideoFile.objects.get(pk=self.pk).video
            old_subtitle = VideoFile.objects.get(pk=self.pk).subtitle
            old_thumbnail = VideoFile.objects.get(pk=self.pk).thumbnail

            # Delete the old video file if it is being updated
            if old_video and old_video.name != self.video.name:
                if os.path.isfile(old_video.path):
                    os.remove(old_video.path)

            # Delete the old subtitle file if it is being updated
            if old_subtitle and old_subtitle.name != self.subtitle.name:
                if os.path.isfile(old_subtitle.path):
                    os.remove(old_subtitle.path)

            # Delete the old thumbnail file if it is being updated
            if old_thumbnail and old_thumbnail.name != self.thumbnail.name:
                if os.path.isfile(old_thumbnail.path):
                    os.remove(old_thumbnail.path)

        # Call the superclass save method to save the new file
        super(VideoFile, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the files associated with the instance before deleting the instance itself
        if self.video and os.path.isfile(self.video.path):
            os.remove(self.video.path)
        if self.subtitle and os.path.isfile(self.subtitle.path):
            os.remove(self.subtitle.path)
        if self.thumbnail and os.path.isfile(self.thumbnail.path):
            os.remove(self.thumbnail.path)

        # Call the superclass delete method to delete the instance
        super(VideoFile, self).delete(*args, **kwargs)