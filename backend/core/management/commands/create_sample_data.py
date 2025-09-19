from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random

from core.models import Project, Issue, Comment, Label, Activity


class Command(BaseCommand):
    help = 'Create sample data for testing the bug reporting system'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=5,
            help='Number of users to create'
        )
        parser.add_argument(
            '--projects',
            type=int,
            default=3,
            help='Number of projects to create'
        )
        parser.add_argument(
            '--issues',
            type=int,
            default=20,
            help='Number of issues to create'
        )
    
    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create users
        users = self.create_users(options['users'])
        self.stdout.write(f'Created {len(users)} users')
        
        # Create labels
        labels = self.create_labels()
        self.stdout.write(f'Created {len(labels)} labels')
        
        # Create projects
        projects = self.create_projects(options['projects'], users)
        self.stdout.write(f'Created {len(projects)} projects')
        
        # Create issues
        issues = self.create_issues(options['issues'], projects, users, labels)
        self.stdout.write(f'Created {len(issues)} issues')
        
        # Create comments
        comments = self.create_comments(issues, users)
        self.stdout.write(f'Created {len(comments)} comments')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
    
    def create_users(self, count):
        users = []
        for i in range(count):
            username = f'user{i+1}'
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=f'{username}@example.com',
                    password='password123',
                    first_name=f'User',
                    last_name=f'{i+1}'
                )
                users.append(user)
        return users
    
    def create_labels(self):
        label_data = [
            ('bug', '#dc3545', 'Something is not working'),
            ('enhancement', '#28a745', 'New feature or request'),
            ('documentation', '#17a2b8', 'Improvements or additions to documentation'),
            ('duplicate', '#6c757d', 'This issue or pull request already exists'),
            ('good first issue', '#7057ff', 'Good for newcomers'),
            ('help wanted', '#008672', 'Extra attention is needed'),
            ('invalid', '#e4e669', 'This does not seem right'),
            ('question', '#d876e3', 'Further information is requested'),
            ('wontfix', '#ffffff', 'This will not be worked on'),
        ]
        
        labels = []
        for name, color, description in label_data:
            label, created = Label.objects.get_or_create(
                name=name,
                defaults={'color': color, 'description': description}
            )
            labels.append(label)
        return labels
    
    def create_projects(self, count, users):
        project_names = [
            'Web Application', 'Mobile App', 'API Service',
            'Desktop Client', 'Database System', 'Analytics Platform'
        ]
        
        projects = []
        for i in range(count):
            name = f'{random.choice(project_names)} {i+1}'
            project = Project.objects.create(
                name=name,
                description=f'Description for {name}',
                created_by=random.choice(users)
            )
            # Add random members
            members = random.sample(users, random.randint(1, min(3, len(users))))
            project.members.set(members)
            projects.append(project)
        return projects
    
    def create_issues(self, count, projects, users, labels):
        issue_titles = [
            'Login page not responsive on mobile',
            'Database connection timeout',
            'Search functionality returns incorrect results',
            'User profile image upload fails',
            'Email notifications not being sent',
            'Performance issues on dashboard',
            'API endpoint returns 500 error',
            'Form validation not working properly',
            'Memory leak in background process',
            'UI elements overlapping on small screens',
            'Export feature generates corrupted files',
            'Authentication token expires too quickly',
            'Charts not displaying correct data',
            'File upload progress bar stuck',
            'Pagination not working on reports page'
        ]
        
        statuses = ['open', 'in_progress', 'resolved', 'closed']
        priorities = ['low', 'medium', 'high', 'critical']
        severities = ['minor', 'major', 'critical', 'blocker']
        
        issues = []
        for i in range(count):
            title = random.choice(issue_titles)
            project = random.choice(projects)
            reporter = random.choice(users)
            assignee = random.choice(users) if random.random() > 0.3 else None
            
            # Create due date (some issues have due dates)
            due_date = None
            if random.random() > 0.5:
                due_date = timezone.now() + timedelta(days=random.randint(1, 30))
            
            issue = Issue.objects.create(
                title=f'{title} #{i+1}',
                description=f'Detailed description for {title}. This issue needs to be addressed.',
                status=random.choice(statuses),
                priority=random.choice(priorities),
                severity=random.choice(severities),
                project=project,
                reporter=reporter,
                assignee=assignee,
                due_date=due_date,
                estimated_hours=random.choice([None, 2, 4, 8, 16, 24])
            )
            
            # Add random labels
            issue_labels = random.sample(labels, random.randint(1, 3))
            for label in issue_labels:
                issue.issue_labels.create(label=label, added_by=reporter)
            
            # Create activity record
            Activity.objects.create(
                action='created',
                description=f'Created issue "{issue.title}"',
                user=reporter,
                issue=issue,
                project=project
            )
            
            issues.append(issue)
        return issues
    
    def create_comments(self, issues, users):
        comment_texts = [
            'I can reproduce this issue on my machine.',
            'This seems to be related to the recent deployment.',
            'I think we need to update the documentation for this.',
            'Can you provide more details about the error?',
            'I\'ve started working on this issue.',
            'This is a duplicate of issue #123.',
            'The fix has been deployed to staging.',
            'I\'ve tested the fix and it works correctly.',
            'We should prioritize this issue.',
            'This might be a browser-specific issue.'
        ]
        
        comments = []
        for issue in issues:
            # Create 0-5 comments per issue
            comment_count = random.randint(0, 5)
            for _ in range(comment_count):
                comment = Comment.objects.create(
                    content=random.choice(comment_texts),
                    issue=issue,
                    author=random.choice(users)
                )
                comments.append(comment)
        return comments
