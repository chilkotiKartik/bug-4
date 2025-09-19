#!/usr/bin/env python3
"""
Database creation and migration script for Bug Reporting System
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.conf import settings

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugreporting.settings')
django.setup()

def create_database():
    """Create database tables and run initial migrations"""
    print("Creating database tables...")
    
    # Make migrations
    print("Creating migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Run migrations
    print("Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("Database setup complete!")

def create_superuser():
    """Create a superuser account"""
    from django.contrib.auth.models import User
    
    username = input("Enter superuser username (default: admin): ") or "admin"
    email = input("Enter superuser email: ")
    
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists!")
        return
    
    if not email:
        print("Email is required!")
        return
    
    # Create superuser
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password='admin123'  # Default password
    )
    
    print(f"Superuser '{username}' created successfully!")
    print("Default password: admin123")
    print("Please change the password after first login.")

def main():
    """Main function to set up the database"""
    print("Bug Reporting System - Database Setup")
    print("=" * 40)
    
    try:
        create_database()
        
        create_super = input("\nCreate superuser account? (y/n): ").lower()
        if create_super in ['y', 'yes']:
            create_superuser()
        
        print("\nDatabase setup completed successfully!")
        print("You can now run the development server with:")
        print("python backend/manage.py runserver")
        
    except Exception as e:
        print(f"Error during database setup: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
