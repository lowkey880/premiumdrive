from django.urls import path
from .views import login_view, logout_view, register_view

urlpatterns = [
    path('login/', login_view, name='auth-login'),
    path('logout/', logout_view, name='auth-logout'),
    path('register/', register_view, name='auth-register'),
]
