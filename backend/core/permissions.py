from rest_framework import permissions


class IsReporterOrAssignee(permissions.BasePermission):
    """
    Custom permission to only allow reporters or assignees to update issues.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the reporter or assignee
        return obj.reporter == request.user or obj.assignee == request.user


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors to edit their comments.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author
        return obj.author == request.user


class IsProjectMemberOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow project members to modify project data.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to project creator or members
        return (obj.created_by == request.user or 
                request.user in obj.members.all())


class IsProjectOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow project owners to delete/modify projects.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Delete/modify permissions only for project owner
        if request.method == 'DELETE':
            return obj.created_by == request.user
        
        # Update permissions for owner or members
        return (obj.created_by == request.user or 
                request.user in obj.members.all())


class CanManageIssue(permissions.BasePermission):
    """
    Custom permission for issue management based on user role.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if user is project member
        is_project_member = (
            obj.project.created_by == request.user or 
            request.user in obj.project.members.all()
        )
        
        # Check if user is issue reporter or assignee
        is_issue_participant = (
            obj.reporter == request.user or 
            obj.assignee == request.user
        )
        
        return is_project_member or is_issue_participant


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to modify certain resources.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff
