#!/usr/bin/env python
"""
Seed script to populate the database with sample data for testing.
Run with: python manage.py shell < scripts/seed_data.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bug_tracker.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Project, Issue, Comment
from django.utils import timezone
import random

def create_sample_data():
    print("🌱 Seeding database with sample data...")
    
    # Create sample users
    users_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'bob_wilson', 'email': 'bob@example.com', 'first_name': 'Bob', 'last_name': 'Wilson'},
        {'username': 'alice_brown', 'email': 'alice@example.com', 'first_name': 'Alice', 'last_name': 'Brown'},
    ]
    
    users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"✅ Created user: {user.username}")
        users.append(user)
    
    # Create sample projects
    projects_data = [
        {
            'name': 'E-commerce Platform',
            'description': 'Main e-commerce website with shopping cart, payment processing, and user accounts.'
        },
        {
            'name': 'Mobile App Backend',
            'description': 'REST API backend for the mobile application with authentication and data management.'
        },
        {
            'name': 'Analytics Dashboard',
            'description': 'Business intelligence dashboard for tracking sales, user engagement, and performance metrics.'
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
            print(f"✅ Created project: {project.name}")
        projects.append(project)
    
    # Create sample issues
    issues_data = [
        {
            'title': 'Shopping cart items disappear on page refresh',
            'description': 'When users refresh the page, all items in their shopping cart are lost. This happens consistently across all browsers.',
            'status': 'open',
            'priority': 'high',
        },
        {
            'title': 'Payment processing timeout error',
            'description': 'Users are experiencing timeout errors during payment processing, especially with credit card transactions over $500.',
            'status': 'in_progress',
            'priority': 'critical',
        },
        {
            'title': 'User profile images not uploading',
            'description': 'Profile image upload feature is not working. Users get a generic error message when trying to upload images.',
            'status': 'open',
            'priority': 'medium',
        },
        {
            'title': 'Search functionality returns incorrect results',
            'description': 'Product search is returning irrelevant results. The search algorithm needs to be improved for better accuracy.',
            'status': 'closed',
            'priority': 'medium',
        },
        {
            'title': 'API rate limiting too aggressive',
            'description': 'Mobile app users are hitting rate limits too quickly, causing the app to become unresponsive.',
            'status': 'open',
            'priority': 'high',
        },
        {
            'title': 'Dashboard charts not loading',
            'description': 'Analytics charts are failing to load for users with large datasets. Need to optimize query performance.',
            'status': 'in_progress',
            'priority': 'medium',
        },
    ]
    
    issues = []
    for issue_data in issues_data:
        project = random.choice(projects)
        reporter = random.choice(users)
        assignee = random.choice(users) if random.random() > 0.3 else None
        
        issue, created = Issue.objects.get_or_create(
            title=issue_data['title'],
            project=project,
            defaults={
                'description': issue_data['description'],
                'status': issue_data['status'],
                'priority': issue_data['priority'],
                'reporter': reporter,
                'assignee': assignee,
            }
        )
        if created:
            print(f"✅ Created issue: {issue.title}")
        issues.append(issue)
    
    # Create sample comments
    comments_data = [
        "I can reproduce this issue on Chrome and Firefox. It seems to be related to session storage.",
        "This is blocking our production deployment. Can we prioritize this?",
        "I've identified the root cause. Working on a fix now.",
        "The issue appears to be in the payment gateway integration. Investigating further.",
        "Fixed in the latest commit. Ready for testing.",
        "Tested and verified. This issue is resolved.",
        "Similar issue reported by multiple users. Needs immediate attention.",
        "I've implemented a temporary workaround. Permanent fix coming soon.",
    ]
    
    for issue in issues:
        # Add 1-4 random comments to each issue
        num_comments = random.randint(1, 4)
        for _ in range(num_comments):
            comment_content = random.choice(comments_data)
            author = random.choice(users)
            
            comment, created = Comment.objects.get_or_create(
                content=comment_content,
                issue=issue,
                author=author,
                defaults={'created_at': timezone.now()}
            )
            if created:
                print(f"✅ Created comment for issue: {issue.title}")
    
    print("\n🎉 Sample data seeding completed!")
    print(f"Created {len(users)} users, {len(projects)} projects, {len(issues)} issues")
    print("\nSample login credentials:")
    print("Username: john_doe, Password: password123")
    print("Username: jane_smith, Password: password123")
    print("Username: bob_wilson, Password: password123")
    print("Username: alice_brown, Password: password123")

if __name__ == "__main__":
    create_sample_data()
