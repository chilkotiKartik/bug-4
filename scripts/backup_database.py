#!/usr/bin/env python3
"""
Database backup utility for Bug Reporting System
"""

import os
import sys
import django
import json
from datetime import datetime
from django.core import serializers

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugreporting.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Project, Issue, Comment, Label, Activity, IssueAttachment, IssueLabel

def create_backup():
    """Create a JSON backup of all data"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
    
    # Create backups directory if it doesn't exist
    os.makedirs(backup_dir, exist_ok=True)
    
    backup_file = os.path.join(backup_dir, f'backup_{timestamp}.json')
    
    print(f"Creating backup: {backup_file}")
    
    # Models to backup
    models_to_backup = [
        User,
        Project,
        Issue,
        Comment,
        Label,
        IssueLabel,
        Activity,
        IssueAttachment,
    ]
    
    all_objects = []
    
    for model in models_to_backup:
        objects = model.objects.all()
        serialized = serializers.serialize('json', objects)
        model_data = json.loads(serialized)
        
        print(f"Backing up {len(model_data)} {model.__name__} objects")
        all_objects.extend(model_data)
    
    # Write backup file
    with open(backup_file, 'w') as f:
        json.dump(all_objects, f, indent=2, default=str)
    
    print(f"Backup completed: {backup_file}")
    print(f"Total objects backed up: {len(all_objects)}")
    
    return backup_file

def restore_backup(backup_file):
    """Restore data from a JSON backup file"""
    if not os.path.exists(backup_file):
        print(f"Backup file not found: {backup_file}")
        return False
    
    print(f"Restoring from backup: {backup_file}")
    
    # Confirm before proceeding
    confirm = input("This will replace all existing data. Continue? (yes/no): ")
    if confirm.lower() != 'yes':
        print("Restore cancelled.")
        return False
    
    try:
        with open(backup_file, 'r') as f:
            backup_data = json.load(f)
        
        print(f"Found {len(backup_data)} objects in backup")
        
        # Clear existing data (in reverse order to handle dependencies)
        models_to_clear = [
            IssueAttachment,
            Activity,
            IssueLabel,
            Comment,
            Issue,
            Project,
            Label,
            # Don't clear User objects to preserve admin accounts
        ]
        
        for model in models_to_clear:
            count = model.objects.count()
            model.objects.all().delete()
            print(f"Cleared {count} {model.__name__} objects")
        
        # Restore data
        for obj_data in backup_data:
            # Skip User objects if they already exist
            if obj_data['model'] == 'auth.user':
                continue
            
            # Deserialize and save
            for obj in serializers.deserialize('json', [obj_data]):
                obj.save()
        
        print("Backup restored successfully!")
        return True
        
    except Exception as e:
        print(f"Error during restore: {e}")
        return False

def list_backups():
    """List available backup files"""
    backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
    
    if not os.path.exists(backup_dir):
        print("No backups directory found.")
        return []
    
    backup_files = [f for f in os.listdir(backup_dir) if f.startswith('backup_') and f.endswith('.json')]
    backup_files.sort(reverse=True)  # Most recent first
    
    if not backup_files:
        print("No backup files found.")
        return []
    
    print("Available backups:")
    for i, filename in enumerate(backup_files, 1):
        filepath = os.path.join(backup_dir, filename)
        size = os.path.getsize(filepath)
        mtime = datetime.fromtimestamp(os.path.getmtime(filepath))
        print(f"  {i}. {filename} ({size} bytes, {mtime.strftime('%Y-%m-%d %H:%M:%S')})")
    
    return backup_files

def main():
    """Main backup utility function"""
    print("Bug Reporting System - Database Backup Utility")
    print("=" * 50)
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python backup_database.py create          - Create a new backup")
        print("  python backup_database.py restore <file>  - Restore from backup")
        print("  python backup_database.py list            - List available backups")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == 'create':
        create_backup()
    
    elif command == 'restore':
        if len(sys.argv) < 3:
            print("Please specify the backup file to restore from.")
            list_backups()
            sys.exit(1)
        
        backup_file = sys.argv[2]
        if not os.path.isabs(backup_file):
            backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
            backup_file = os.path.join(backup_dir, backup_file)
        
        restore_backup(backup_file)
    
    elif command == 'list':
        list_backups()
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()
