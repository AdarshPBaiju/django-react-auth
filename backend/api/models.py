from django.db import models
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
    