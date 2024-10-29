from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.contrib.auth.hashers import make_password


from .models import User, Profile
from .serializers import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer

from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = ([AllowAny])
    

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

        try:
            d_uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=d_uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid verification link"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if token is valid
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email successfully verified"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    print("User:", request.user)  # Check the user
    if request.method == 'GET':
        response = f"Hey {request.user}, you are seeing a get response"
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        text = request.data.get("text")  # Use request.data for POST data
        response = f"Hey {request.user}, your text is {text}"
        return Response({'response': response}, status=status.HTTP_201_CREATED)

    return Response({}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_data(request):
    try:
        user = User.objects.get(email=request.user.email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method in ['PUT', 'PATCH']:
        serializer = UserSerializer(user, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Extract the refresh token from the request
            refresh_token = request.data.get('refresh')
            if refresh_token is None:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, email=email)
        if not user:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        # Send email with frontent url
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = settings.FRONTEND_URL
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}"
        subject = "Password Reset Requested"
        message = f"Please use the link below to reset your password:\n{reset_link}"
        from_email = settings.DEFAULT_FROM_EMAIL  # Ensure you have set your default from email
        send_mail(subject, message, from_email, [email])
        
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)


class VerifyResetPasswordLink(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

        # Validate request data
        if not uid or not token:
            return Response({'error': 'UID and token are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode UID to get user ID
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
        except (TypeError, ValueError, OverflowError):
            user_id = None
        
        # Retrieve user by ID (email in this case)
        user = get_object_or_404(User, pk=user_id)  # `pk` should be the email field if `email` is the primary key

        # Validate the token
        if default_token_generator.check_token(user, token):
            return Response({'message': 'Valid reset password link.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired reset password link.'}, status=status.HTTP_400_BAD_REQUEST)
        

class ConfirmResetPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('newPassword')

        # Validate request data
        if not uid or not token or not new_password:
            return Response({'error': 'UID, token, and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode UID to get user ID
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
        except (TypeError, ValueError, OverflowError):
            user_id = None

        # Retrieve user by ID
        user = get_object_or_404(User, pk=user_id)

        # Validate the token
        if default_token_generator.check_token(user, token):
            # Update the password
            user.password = make_password(new_password)  # Hash the new password
            user.is_active=True
            user.save()
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired reset password link.'}, status=status.HTTP_400_BAD_REQUEST)