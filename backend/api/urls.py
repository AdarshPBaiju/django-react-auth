from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path

from .views import MyTokenObtainPairView, RegisterView, dashboard, LogoutView,user_data

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('dashboard/', dashboard, name='dashboard'),
    path('userdata/', user_data, name='user_data'),
    path('token/logout/', LogoutView.as_view(), name='token_blacklist'),
]
