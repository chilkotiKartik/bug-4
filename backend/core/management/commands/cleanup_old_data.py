from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from core.models import Activity, Issue, Project


class Command(BaseCommand):
    help = 'Clean up old data from the system'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=365,
            help='Delete activities older than this many days'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )
    
    def handle(self, *args, **options):
        cutoff_date = timezone.now() - timedelta(days=options['days'])
        
        # Find old activities
        old_activities = Activity.objects.filter(created_at__lt=cutoff_date)
        activity_count = old_activities.count()
        
        # Find inactive projects with no recent activity
        inactive_projects = Project.objects.filter(
            is_active=False,
            updated_at__lt=cutoff_date
        )
        project_count = inactive_projects.count()
        
        # Find closed issues older than cutoff
        old_closed_issues = Issue.objects.filter(
            status='closed',
            updated_at__lt=cutoff_date,
            is_active=True
        )
        issue_count = old_closed_issues.count()
        
        if options['dry_run']:
            self.stdout.write(f'Would delete {activity_count} old activities')
            self.stdout.write(f'Would archive {project_count} inactive projects')
            self.stdout.write(f'Would archive {issue_count} old closed issues')
        else:
            # Delete old activities
            deleted_activities = old_activities.delete()[0]
            
            # Archive old projects (soft delete)
            for project in inactive_projects:
                project.is_active = False
                project.save()
            
            # Archive old closed issues (soft delete)
            for issue in old_closed_issues:
                issue.is_active = False
                issue.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Deleted {deleted_activities} activities, '
                    f'archived {project_count} projects, '
                    f'archived {issue_count} issues'
                )
            )
