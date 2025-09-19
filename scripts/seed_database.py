#!/usr/bin/env python3
"""
Database seeding script with comprehensive sample data
"""

import os
import sys
import django
from django.utils import timezone
from datetime import timedelta
import random

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugreporting.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Project, Issue, Comment, Label, Activity, IssueAttachment

def create_users():
    """Create sample users"""
    users_data = [
        ('john_doe', 'john@example.com', 'John', 'Doe'),
        ('jane_smith', 'jane@example.com', 'Jane', 'Smith'),
        ('bob_wilson', 'bob@example.com', 'Bob', 'Wilson'),
        ('alice_brown', 'alice@example.com', 'Alice', 'Brown'),
        ('charlie_davis', 'charlie@example.com', 'Charlie', 'Davis'),
        ('diana_miller', 'diana@example.com', 'Diana', 'Miller'),
        ('frank_garcia', 'frank@example.com', 'Frank', 'Garcia'),
        ('grace_lee', 'grace@example.com', 'Grace', 'Lee'),
    ]
    
    users = []
    for username, email, first_name, last_name in users_data:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"Created user: {username}")
        users.append(user)
    
    return users

def create_labels():
    """Create issue labels"""
    labels_data = [
        ('bug', '#dc3545', 'Something is not working correctly'),
        ('enhancement', '#28a745', 'New feature or improvement request'),
        ('documentation', '#17a2b8', 'Documentation needs update'),
        ('duplicate', '#6c757d', 'This issue already exists'),
        ('good first issue', '#7057ff', 'Good for newcomers'),
        ('help wanted', '#008672', 'Extra attention needed'),
        ('invalid', '#e4e669', 'This does not seem right'),
        ('question', '#d876e3', 'Further information requested'),
        ('wontfix', '#ffffff', 'This will not be worked on'),
        ('critical', '#ff0000', 'Critical issue requiring immediate attention'),
        ('performance', '#ff9500', 'Performance related issue'),
        ('security', '#8b0000', 'Security vulnerability'),
        ('ui/ux', '#ff69b4', 'User interface or experience issue'),
        ('backend', '#4169e1', 'Backend/server related issue'),
        ('frontend', '#32cd32', 'Frontend/client related issue'),
    ]
    
    labels = []
    for name, color, description in labels_data:
        label, created = Label.objects.get_or_create(
            name=name,
            defaults={'color': color, 'description': description}
        )
        if created:
            print(f"Created label: {name}")
        labels.append(label)
    
    return labels

def create_projects(users):
    """Create sample projects"""
    projects_data = [
        {
            'name': 'E-Commerce Platform',
            'description': 'Online shopping platform with user accounts, product catalog, and payment processing.',
        },
        {
            'name': 'Task Management System',
            'description': 'Project management tool for teams to track tasks, deadlines, and progress.',
        },
        {
            'name': 'Customer Support Portal',
            'description': 'Help desk system for managing customer inquiries and support tickets.',
        },
        {
            'name': 'Analytics Dashboard',
            'description': 'Business intelligence dashboard for data visualization and reporting.',
        },
        {
            'name': 'Mobile Banking App',
            'description': 'Secure mobile application for banking transactions and account management.',
        },
    ]
    
    projects = []
    for project_data in projects_data:
        project, created = Project.objects.get_or_create(
            name=project_data['name'],
            defaults={
                'description': project_data['description'],
                'created_by': random.choice(users),
            }
        )
        if created:
            # Add random team members
            team_size = random.randint(2, 5)
            members = random.sample(users, min(team_size, len(users)))
            project.members.set(members)
            print(f"Created project: {project.name}")
        projects.append(project)
    
    return projects

def create_issues(projects, users, labels):
    """Create sample issues"""
    issue_templates = [
        {
            'title': 'Login page not responsive on mobile devices',
            'description': 'The login form elements are not properly aligned on mobile screens. The submit button is cut off and the input fields are too narrow.',
            'priority': 'high',
            'severity': 'major',
        },
        {
            'title': 'Database connection timeout during peak hours',
            'description': 'Users are experiencing slow response times and connection timeouts during peak usage hours (9-11 AM and 2-4 PM).',
            'priority': 'critical',
            'severity': 'critical',
        },
        {
            'title': 'Search functionality returns incorrect results',
            'description': 'The search feature is not filtering results correctly. It seems to ignore some search terms and returns unrelated items.',
            'priority': 'medium',
            'severity': 'major',
        },
        {
            'title': 'User profile image upload fails silently',
            'description': 'When users try to upload a profile image, the upload appears to succeed but the image is not saved or displayed.',
            'priority': 'medium',
            'severity': 'minor',
        },
        {
            'title': 'Email notifications not being sent',
            'description': 'Users are not receiving email notifications for password resets, account confirmations, or system updates.',
            'priority': 'high',
            'severity': 'major',
        },
        {
            'title': 'Performance issues on dashboard page',
            'description': 'The main dashboard takes 10-15 seconds to load completely. This affects user experience significantly.',
            'priority': 'high',
            'severity': 'major',
        },
        {
            'title': 'API endpoint returns 500 error for large datasets',
            'description': 'The /api/reports endpoint fails with a 500 internal server error when trying to fetch reports with more than 1000 records.',
            'priority': 'medium',
            'severity': 'major',
        },
        {
            'title': 'Form validation not working properly',
            'description': 'Client-side form validation is not preventing invalid data submission. Server-side validation works but user experience is poor.',
            'priority': 'medium',
            'severity': 'minor',
        },
        {
            'title': 'Memory leak in background process',
            'description': 'The background job processor is consuming increasing amounts of memory over time, eventually causing the server to run out of RAM.',
            'priority': 'critical',
            'severity': 'blocker',
        },
        {
            'title': 'Export feature generates corrupted files',
            'description': 'When users export data to CSV or Excel format, the generated files are corrupted and cannot be opened properly.',
            'priority': 'medium',
            'severity': 'major',
        },
    ]
    
    statuses = ['open', 'in_progress', 'resolved', 'closed', 'reopened']
    
    issues = []
    for project in projects:
        # Create 3-8 issues per project
        num_issues = random.randint(3, 8)
        project_issues = random.sample(issue_templates, min(num_issues, len(issue_templates)))
        
        for i, template in enumerate(project_issues):
            reporter = random.choice(users)
            assignee = random.choice(users) if random.random() > 0.3 else None
            
            # Create due date for some issues
            due_date = None
            if random.random() > 0.4:
                days_ahead = random.randint(1, 60)
                due_date = timezone.now() + timedelta(days=days_ahead)
            
            issue = Issue.objects.create(
                title=f"{template['title']} - {project.name}",
                description=template['description'],
                status=random.choice(statuses),
                priority=template['priority'],
                severity=template['severity'],
                project=project,
                reporter=reporter,
                assignee=assignee,
                due_date=due_date,
                estimated_hours=random.choice([None, 2, 4, 8, 16, 24, 40])
            )
            
            # Add random labels
            issue_labels = random.sample(labels, random.randint(1, 4))
            for label in issue_labels:
                issue.issue_labels.create(
                    label=label,
                    added_by=reporter
                )
            
            # Add watchers
            watchers = random.sample(users, random.randint(0, 3))
            issue.watchers.set(watchers)
            
            # Create activity record
            Activity.objects.create(
                action='created',
                description=f'Created issue "{issue.title}"',
                user=reporter,
                issue=issue,
                project=project
            )
            
            issues.append(issue)
            print(f"Created issue: {issue.title[:50]}...")
    
    return issues

def create_comments(issues, users):
    """Create sample comments"""
    comment_templates = [
        "I can reproduce this issue on my local environment.",
        "This seems to be related to the recent deployment on Friday.",
        "I think we need to update the documentation for this feature.",
        "Can you provide more details about the browser and OS you're using?",
        "I've started working on this issue and will have a fix ready soon.",
        "This looks like a duplicate of issue #{} that we fixed last month.",
        "The fix has been deployed to the staging environment for testing.",
        "I've tested the proposed solution and it works correctly.",
        "We should prioritize this issue as it affects many users.",
        "This might be a browser-specific issue. Have you tried Chrome?",
        "I've added some additional logging to help debug this problem.",
        "The root cause appears to be in the database query optimization.",
        "I suggest we schedule a meeting to discuss the technical approach.",
        "This issue is blocking the release. We need to fix it ASAP.",
        "I've created a pull request with the proposed changes.",
        "The QA team has verified that this issue is resolved.",
        "We need to add unit tests to prevent this regression.",
        "I've updated the issue description with more technical details.",
        "This is working as expected in the development environment.",
        "I recommend we create a separate issue for the performance aspect.",
    ]
    
    comments = []
    for issue in issues:
        # Create 0-8 comments per issue
        num_comments = random.randint(0, 8)
        
        for i in range(num_comments):
            author = random.choice(users)
            content = random.choice(comment_templates)
            
            # Some comments might reference other issues
            if '{}' in content:
                random_issue_id = random.randint(1, 100)
                content = content.format(random_issue_id)
            
            comment = Comment.objects.create(
                content=content,
                issue=issue,
                author=author,
                is_edited=random.random() > 0.8  # 20% chance of being edited
            )
            comments.append(comment)
    
    print(f"Created {len(comments)} comments")
    return comments

def create_activities(issues, users):
    """Create additional activity records"""
    activities = []
    action_templates = [
        ('status_changed', 'Changed status from Open to In Progress'),
        ('priority_changed', 'Changed priority from Medium to High'),
        ('assigned', 'Assigned issue to {}'),
        ('commented', 'Added a comment'),
        ('updated', 'Updated issue description'),
        ('reopened', 'Reopened the issue'),
        ('closed', 'Closed the issue as resolved'),
    ]
    
    for issue in issues:
        # Create 1-5 additional activities per issue
        num_activities = random.randint(1, 5)
        
        for _ in range(num_activities):
            action, description_template = random.choice(action_templates)
            user = random.choice(users)
            
            description = description_template
            if '{}' in description:
                target_user = random.choice(users)
                description = description.format(target_user.get_full_name() or target_user.username)
            
            activity = Activity.objects.create(
                action=action,
                description=description,
                user=user,
                issue=issue,
                project=issue.project
            )
            activities.append(activity)
    
    print(f"Created {len(activities)} activity records")
    return activities

def main():
    """Main seeding function"""
    print("Bug Reporting System - Database Seeding")
    print("=" * 40)
    
    try:
        print("Creating sample users...")
        users = create_users()
        
        print("Creating labels...")
        labels = create_labels()
        
        print("Creating projects...")
        projects = create_projects(users)
        
        print("Creating issues...")
        issues = create_issues(projects, users, labels)
        
        print("Creating comments...")
        comments = create_comments(issues, users)
        
        print("Creating additional activities...")
        activities = create_activities(issues, users)
        
        print("\n" + "=" * 40)
        print("Database seeding completed successfully!")
        print(f"Created:")
        print(f"  - {len(users)} users")
        print(f"  - {len(labels)} labels")
        print(f"  - {len(projects)} projects")
        print(f"  - {len(issues)} issues")
        print(f"  - {len(comments)} comments")
        print(f"  - {len(activities)} activities")
        print("\nYou can now explore the system with sample data!")
        
    except Exception as e:
        print(f"Error during database seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
