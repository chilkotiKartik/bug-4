from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import Project, Issue, Comment, Activity, Label, IssueAttachment, IssueLabel


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'members_count', 'issues_count', 'created_at', 'is_active']
    list_filter = ['created_at', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['members']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            issues_count=Count('issues', distinct=True),
            members_count=Count('members', distinct=True)
        )
    
    def issues_count(self, obj):
        return obj.issues_count
    issues_count.admin_order_field = 'issues_count'
    issues_count.short_description = 'Issues'
    
    def members_count(self, obj):
        return obj.members_count
    members_count.admin_order_field = 'members_count'
    members_count.short_description = 'Members'


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'project', 'status', 'priority', 'severity', 
        'reporter', 'assignee', 'due_date', 'is_overdue', 'created_at'
    ]
    list_filter = [
        'status', 'priority', 'severity', 'created_at', 
        'due_date', 'project', 'is_active'
    ]
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'is_overdue']
    raw_id_fields = ['project', 'reporter', 'assignee']
    filter_horizontal = ['watchers']
    date_hierarchy = 'created_at'
    actions = ['mark_as_resolved', 'mark_as_closed', 'assign_to_me']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'project')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'severity')
        }),
        ('Assignment', {
            'fields': ('reporter', 'assignee', 'watchers')
        }),
        ('Timeline', {
            'fields': ('due_date', 'estimated_hours')
        }),
        ('System Fields', {
            'fields': ('created_at', 'updated_at', 'is_active'),
            'classes': ('collapse',)
        })
    )
    
    def is_overdue(self, obj):
        if obj.is_overdue:
            return format_html('<span style="color: red;">Yes</span>')
        return 'No'
    is_overdue.short_description = 'Overdue'
    
    def mark_as_resolved(self, request, queryset):
        updated = queryset.update(status='resolved')
        self.message_user(request, f'{updated} issues marked as resolved.')
    mark_as_resolved.short_description = 'Mark selected issues as resolved'
    
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} issues marked as closed.')
    mark_as_closed.short_description = 'Mark selected issues as closed'
    
    def assign_to_me(self, request, queryset):
        updated = queryset.update(assignee=request.user)
        self.message_user(request, f'{updated} issues assigned to you.')
    assign_to_me.short_description = 'Assign selected issues to me'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['issue_link', 'author', 'content_preview', 'created_at', 'is_edited']
    list_filter = ['created_at', 'is_edited']
    search_fields = ['content', 'issue__title']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['issue', 'author', 'parent']
    date_hierarchy = 'created_at'
    
    def issue_link(self, obj):
        url = reverse('admin:core_issue_change', args=[obj.issue.id])
        return format_html('<a href="{}">{}</a>', url, obj.issue.title)
    issue_link.short_description = 'Issue'
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content'


@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_display', 'description', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']
    
    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 2px 8px; border-radius: 3px; color: white;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Color'


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'issue_link', 'project_link', 'created_at']
    list_filter = ['action', 'created_at', 'project']
    search_fields = ['description', 'issue__title', 'project__name']
    readonly_fields = ['created_at']
    raw_id_fields = ['user', 'issue', 'project']
    date_hierarchy = 'created_at'
    
    def issue_link(self, obj):
        if obj.issue:
            url = reverse('admin:core_issue_change', args=[obj.issue.id])
            return format_html('<a href="{}">{}</a>', url, obj.issue.title)
        return '-'
    issue_link.short_description = 'Issue'
    
    def project_link(self, obj):
        if obj.project:
            url = reverse('admin:core_project_change', args=[obj.project.id])
            return format_html('<a href="{}">{}</a>', url, obj.project.name)
        return '-'
    project_link.short_description = 'Project'


@admin.register(IssueAttachment)
class IssueAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'issue_link', 'file_size_display', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['filename', 'issue__title']
    readonly_fields = ['uploaded_at', 'file_size']
    raw_id_fields = ['issue', 'uploaded_by']
    date_hierarchy = 'uploaded_at'
    
    def issue_link(self, obj):
        url = reverse('admin:core_issue_change', args=[obj.issue.id])
        return format_html('<a href="{}">{}</a>', url, obj.issue.title)
    issue_link.short_description = 'Issue'
    
    def file_size_display(self, obj):
        if obj.file_size < 1024:
            return f'{obj.file_size} B'
        elif obj.file_size < 1024 * 1024:
            return f'{obj.file_size / 1024:.1f} KB'
        else:
            return f'{obj.file_size / (1024 * 1024):.1f} MB'
    file_size_display.short_description = 'File Size'


@admin.register(IssueLabel)
class IssueLabelAdmin(admin.ModelAdmin):
    list_display = ['issue_link', 'label', 'added_by', 'added_at']
    list_filter = ['added_at', 'label']
    search_fields = ['issue__title', 'label__name']
    readonly_fields = ['added_at']
    raw_id_fields = ['issue', 'label', 'added_by']
    date_hierarchy = 'added_at'
    
    def issue_link(self, obj):
        url = reverse('admin:core_issue_change', args=[obj.issue.id])
        return format_html('<a href="{}">{}</a>', url, obj.issue.title)
    issue_link.short_description = 'Issue'


admin.site.site_header = 'Bug Reporting System Administration'
admin.site.site_title = 'Bug Reporting Admin'
admin.site.index_title = 'Welcome to Bug Reporting System Administration'
