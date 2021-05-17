from django.urls import path
from .views import task_api_view, tasks_api_view
urlpatterns = [
    path('', tasks_api_view, name='tasks_api'),
    path('task/<int:pk>/', task_api_view, name='task_api'),
]