from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Project, Issue, Comment, Activity, Label, IssueAttachment


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'avatar', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_active']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_avatar(self, obj):
        # Return a placeholder avatar URL - in production, you'd use actual user avatars
        return f"/placeholder.svg?height=40&width=40"


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    issues_count = serializers.SerializerMethodField()
    open_issues_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'created_at', 'updated_at',
            'created_by', 'members', 'member_ids', 'issues_count', 
            'open_issues_count', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'is_active']
    
    def get_issues_count(self, obj):
        return obj.issues_count
    
    def get_open_issues_count(self, obj):
        return obj.open_issues_count
    
    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])
        validated_data['created_by'] = self.context['request'].user
        project = super().create(validated_data)
        
        if member_ids:
            members = User.objects.filter(id__in=member_ids)
            project.members.set(members)
        
        return project
    
    def update(self, instance, validated_data):
        member_ids = validated_data.pop('member_ids', None)
        instance = super().update(instance, validated_data)
        
        if member_ids is not None:
            members = User.objects.filter(id__in=member_ids)
            instance.members.set(members)
        
        return instance


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name', 'color', 'description', 'created_at']
        read_only_fields = ['created_at']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'updated_at', 'author', 'parent', 'replies', 'is_edited']
        read_only_fields = ['created_at', 'updated_at', 'author', 'is_edited']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class IssueSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    comments_count = serializers.SerializerMethodField()
    labels = LabelSerializer(many=True, read_only=True)
    label_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'severity',
            'created_at', 'updated_at', 'due_date', 'estimated_hours',
            'project', 'project_name', 'reporter', 'assignee', 'assignee_id',
            'comments_count', 'labels', 'label_ids', 'is_overdue', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at', 'reporter', 'project', 'is_active']
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def create(self, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        label_ids = validated_data.pop('label_ids', [])
        validated_data['reporter'] = self.context['request'].user
        
        if assignee_id:
            try:
                assignee = User.objects.get(id=assignee_id)
                validated_data['assignee'] = assignee
            except User.DoesNotExist:
                pass
        
        issue = super().create(validated_data)
        
        if label_ids:
            labels = Label.objects.filter(id__in=label_ids)
            for label in labels:
                issue.issue_labels.create(
                    label=label,
                    added_by=self.context['request'].user
                )
        
        return issue
    
    def update(self, instance, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        label_ids = validated_data.pop('label_ids', None)
        
        if assignee_id is not None:
            if assignee_id:
                try:
                    assignee = User.objects.get(id=assignee_id)
                    validated_data['assignee'] = assignee
                except User.DoesNotExist:
                    pass
            else:
                validated_data['assignee'] = None
        
        instance = super().update(instance, validated_data)
        
        if label_ids is not None:
            # Remove existing labels
            instance.issue_labels.all().delete()
            # Add new labels
            labels = Label.objects.filter(id__in=label_ids)
            for label in labels:
                instance.issue_labels.create(
                    label=label,
                    added_by=self.context['request'].user
                )
        
        return instance


class IssueDetailSerializer(IssueSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    attachments = serializers.SerializerMethodField()
    
    class Meta(IssueSerializer.Meta):
        fields = IssueSerializer.Meta.fields + ['comments', 'attachments']
    
    def get_attachments(self, obj):
        return IssueAttachmentSerializer(obj.attachments.all(), many=True, context=self.context).data


class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    issue_title = serializers.CharField(source='issue.title', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'action', 'description', 'created_at', 'user', 'issue_title', 'project_name']


class IssueAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = IssueAttachment
        fields = ['id', 'filename', 'file', 'file_size', 'uploaded_at', 'uploaded_by']
        read_only_fields = ['uploaded_at', 'uploaded_by', 'file_size']
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        validated_data['file_size'] = validated_data['file'].size
        validated_data['filename'] = validated_data['file'].name
        return super().create(validated_data)
