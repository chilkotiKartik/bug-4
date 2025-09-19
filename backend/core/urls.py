from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.user_profile, name='user_profile'),
    path('auth/profile/update/', views.update_profile, name='update_profile'),
    
    # Dashboard
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
    
    # Search
    path('search/', views.global_search, name='global_search'),
    
    # Users
    path('users/', views.UserListView.as_view(), name='user-list'),
    
    # Projects
    path('projects/', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<int:project_id>/analytics/', views.project_analytics, name='project-analytics'),
    
    # Issues
    path('projects/<int:project_id>/issues/', views.IssueListCreateView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', views.IssueDetailView.as_view(), name='issue-detail'),
    path('issues/bulk-update/', views.bulk_update_issues, name='bulk-update-issues'),
    
    # Comments
    path('issues/<int:issue_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    
    # Labels
    path('labels/', views.LabelListCreateView.as_view(), name='label-list-create'),
    
    # Activities
    path('projects/<int:project_id>/activities/', views.ActivityListView.as_view(), name='project-activities'),
    path('issues/<int:issue_id>/activities/', views.ActivityListView.as_view(), name='issue-activities'),
    
    # File uploads
    path('issues/<int:issue_id>/attachments/', views.IssueAttachmentListCreateView.as_view(), name='issue-attachments'),
    
    # Include router URLs
    path('', include(router.urls)),
]
