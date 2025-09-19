from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch, Q
from django.utils import timezone
from datetime import timedelta

from .models import Project, Issue, Comment, Activity, Label, IssueAttachment
from .serializers import (
    ProjectSerializer, IssueSerializer, IssueDetailSerializer, 
    CommentSerializer, UserSerializer, ActivitySerializer,
    LabelSerializer, IssueAttachmentSerializer, CustomTokenObtainPairSerializer
)
from .permissions import IsReporterOrAssignee, IsAuthorOrReadOnly


# Authentication Views
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view with enhanced user data
    """
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user account
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    # Enhanced validation
    if not username or not email or not password:
        return Response(
            {'error': 'Username, email, and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': 'Failed to create user account'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by blacklisting the refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get current user profile
    """
    return Response(UserSerializer(request.user).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update current user profile
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Project Views
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Project.objects.filter(is_active=True).select_related('created_by').prefetch_related('issues')
        
        # Filter by user's projects if requested
        if self.request.query_params.get('my_projects'):
            queryset = queryset.filter(
                Q(created_by=self.request.user) | Q(members=self.request.user)
            ).distinct()
            
        return queryset


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(is_active=True).select_related('created_by')
    
    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save()


# Issue Views
class IssueListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'severity', 'assignee']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'due_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        project_id = self.kwargs['project_id']
        queryset = Issue.objects.filter(
            project_id=project_id, 
            is_active=True
        ).select_related(
            'project', 'reporter', 'assignee'
        ).prefetch_related('comments')
        
        # Filter overdue issues if requested
        if self.request.query_params.get('overdue'):
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['open', 'in_progress', 'reopened']
            )
            
        return queryset
    
    def perform_create(self, serializer):
        project_id = self.kwargs['project_id']
        project = Project.objects.get(id=project_id)
        issue = serializer.save(project=project)
        
        # Create activity record
        Activity.objects.create(
            action='created',
            description=f'Created issue "{issue.title}"',
            user=self.request.user,
            issue=issue,
            project=project
        )


class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = IssueDetailSerializer
    permission_classes = [IsAuthenticated, IsReporterOrAssignee]
    
    def get_queryset(self):
        return Issue.objects.filter(is_active=True).select_related(
            'project', 'reporter', 'assignee'
        ).prefetch_related(
            Prefetch('comments', queryset=Comment.objects.select_related('author'))
        )
    
    def perform_update(self, serializer):
        old_instance = self.get_object()
        instance = serializer.save()
        
        # Track status changes
        if old_instance.status != instance.status:
            Activity.objects.create(
                action='status_changed',
                description=f'Changed status from {old_instance.get_status_display()} to {instance.get_status_display()}',
                user=self.request.user,
                issue=instance,
                project=instance.project
            )
    
    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save()


# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        issue_id = self.kwargs['issue_id']
        return Comment.objects.filter(issue_id=issue_id).select_related('author', 'issue')
    
    def perform_create(self, serializer):
        issue_id = self.kwargs['issue_id']
        issue = Issue.objects.get(id=issue_id)
        serializer.save(issue=issue)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        return Comment.objects.select_related('author', 'issue')


# User Views
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']


# Label Views
class LabelListCreateView(generics.ListCreateAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


# Activity Views
class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        issue_id = self.kwargs.get('issue_id')
        
        queryset = Activity.objects.select_related('user', 'issue', 'project')
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if issue_id:
            queryset = queryset.filter(issue_id=issue_id)
            
        return queryset


class DashboardStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user's projects
        user_projects = Project.objects.filter(
            Q(created_by=user) | Q(members=user),
            is_active=True
        ).distinct()
        
        # Calculate stats
        total_projects = user_projects.count()
        total_issues = Issue.objects.filter(
            project__in=user_projects,
            is_active=True
        ).count()
        
        assigned_issues = Issue.objects.filter(
            assignee=user,
            is_active=True,
            status__in=['open', 'in_progress', 'reopened']
        ).count()
        
        overdue_issues = Issue.objects.filter(
            project__in=user_projects,
            is_active=True,
            due_date__lt=timezone.now(),
            status__in=['open', 'in_progress', 'reopened']
        ).count()
        
        # Recent activity
        recent_activities = Activity.objects.filter(
            project__in=user_projects
        ).select_related('user', 'issue', 'project')[:10]
        
        return Response({
            'total_projects': total_projects,
            'total_issues': total_issues,
            'assigned_issues': assigned_issues,
            'overdue_issues': overdue_issues,
            'recent_activities': ActivitySerializer(recent_activities, many=True).data
        })


# Issue Attachment Views
class IssueAttachmentListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueAttachmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        issue_id = self.kwargs['issue_id']
        return IssueAttachment.objects.filter(issue_id=issue_id).select_related('uploaded_by')
    
    def perform_create(self, serializer):
        issue_id = self.kwargs['issue_id']
        issue = Issue.objects.get(id=issue_id)
        serializer.save(issue=issue)


# Bulk Operations Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_update_issues(request):
    """
    Bulk update multiple issues at once
    """
    issue_ids = request.data.get('issue_ids', [])
    updates = request.data.get('updates', {})
    
    if not issue_ids or not updates:
        return Response(
            {'error': 'issue_ids and updates are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get issues that user can modify
    issues = Issue.objects.filter(
        id__in=issue_ids,
        is_active=True
    ).select_related('project', 'reporter', 'assignee')
    
    updated_issues = []
    for issue in issues:
        # Check permissions
        can_update = (
            issue.reporter == request.user or 
            issue.assignee == request.user or
            issue.project.created_by == request.user or
            request.user in issue.project.members.all()
        )
        
        if can_update:
            # Apply updates
            for field, value in updates.items():
                if hasattr(issue, field) and field not in ['id', 'created_at', 'reporter', 'project']:
                    if field == 'assignee_id':
                        if value:
                            try:
                                assignee = User.objects.get(id=value)
                                issue.assignee = assignee
                            except User.DoesNotExist:
                                continue
                        else:
                            issue.assignee = None
                    else:
                        setattr(issue, field, value)
            
            issue.save()
            updated_issues.append(issue)
    
    return Response({
        'updated_count': len(updated_issues),
        'issues': IssueSerializer(updated_issues, many=True).data
    })


# Search Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def global_search(request):
    """
    Global search across projects, issues, and comments
    """
    query = request.GET.get('q', '').strip()
    if not query or len(query) < 3:
        return Response(
            {'error': 'Search query must be at least 3 characters'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get user's accessible projects
    user_projects = Project.objects.filter(
        Q(created_by=request.user) | Q(members=request.user),
        is_active=True
    ).distinct()
    
    # Search projects
    projects = user_projects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    )[:10]
    
    # Search issues
    issues = Issue.objects.filter(
        project__in=user_projects,
        is_active=True
    ).filter(
        Q(title__icontains=query) | Q(description__icontains=query)
    ).select_related('project', 'reporter', 'assignee')[:20]
    
    # Search comments
    comments = Comment.objects.filter(
        issue__project__in=user_projects,
        content__icontains=query
    ).select_related('author', 'issue')[:15]
    
    return Response({
        'projects': ProjectSerializer(projects, many=True).data,
        'issues': IssueSerializer(issues, many=True).data,
        'comments': CommentSerializer(comments, many=True).data,
        'total_results': projects.count() + issues.count() + comments.count()
    })


# Analytics Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_analytics(request, project_id):
    """
    Get analytics data for a specific project
    """
    try:
        project = Project.objects.get(id=project_id, is_active=True)
    except Project.DoesNotExist:
        return Response(
            {'error': 'Project not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if user has access to project
    if not (project.created_by == request.user or request.user in project.members.all()):
        return Response(
            {'error': 'Access denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Calculate analytics
    issues = Issue.objects.filter(project=project, is_active=True)
    
    status_counts = {}
    for status_choice in Issue.STATUS_CHOICES:
        status_counts[status_choice[0]] = issues.filter(status=status_choice[0]).count()
    
    priority_counts = {}
    for priority_choice in Issue.PRIORITY_CHOICES:
        priority_counts[priority_choice[0]] = issues.filter(priority=priority_choice[0]).count()
    
    # Recent activity
    recent_activities = Activity.objects.filter(
        project=project
    ).select_related('user', 'issue')[:20]
    
    # Top contributors
    from django.db.models import Count
    top_contributors = User.objects.filter(
        Q(reported_issues__project=project) | Q(assigned_issues__project=project)
    ).annotate(
        issue_count=Count('reported_issues', filter=Q(reported_issues__project=project)) +
                   Count('assigned_issues', filter=Q(assigned_issues__project=project))
    ).order_by('-issue_count')[:10]
    
    return Response({
        'project': ProjectSerializer(project).data,
        'total_issues': issues.count(),
        'status_distribution': status_counts,
        'priority_distribution': priority_counts,
        'recent_activities': ActivitySerializer(recent_activities, many=True).data,
        'top_contributors': UserSerializer(top_contributors, many=True).data,
        'overdue_issues': issues.filter(
            due_date__lt=timezone.now(),
            status__in=['open', 'in_progress', 'reopened']
        ).count()
    })
