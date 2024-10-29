from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path

from .views import MyTokenObtainPairView, RegisterView, DashboardView, LogoutView,user_data, ResetPassword, VerifyResetPasswordLink, ConfirmResetPassword, VerifyEmailView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('userdata/', user_data, name='user_data'),
    path('token/logout/', LogoutView.as_view(), name='token_blacklist'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('reset-password/verify/', VerifyResetPasswordLink.as_view(), name='verify_reset_password'),
    path('reset-password/confirm/', ConfirmResetPassword.as_view(), name='confirm_reset_password'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
 
]
