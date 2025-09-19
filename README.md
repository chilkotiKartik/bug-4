# Bug Reporting System

A comprehensive Django REST API-based bug reporting and issue tracking system with advanced features for project management, user collaboration, and activity tracking.

## Features

### Core Functionality
- **Project Management**: Create and manage multiple projects with team members
- **Issue Tracking**: Comprehensive issue management with status, priority, and severity levels
- **User Authentication**: JWT-based authentication with user profiles
- **Comments & Collaboration**: Threaded comments and issue discussions
- **File Attachments**: Upload and manage issue attachments
- **Labels & Tags**: Organize issues with customizable labels
- **Activity Tracking**: Complete audit trail of all system activities

### Advanced Features
- **Dashboard Analytics**: Project statistics and performance metrics
- **Global Search**: Search across projects, issues, and comments
- **Bulk Operations**: Update multiple issues simultaneously
- **Due Date Tracking**: Issue deadline management with overdue detection
- **Soft Deletion**: Safe data archival without permanent loss
- **Admin Interface**: Comprehensive Django admin with custom views
- **Management Commands**: Database utilities and sample data generation

## Technology Stack

- **Backend**: Django 4.2+ with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with SimpleJWT
- **API Documentation**: Django REST Framework browsable API
- **Admin Interface**: Enhanced Django Admin with custom functionality

## Installation

### Quick Setup (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bug-reporting-system
   \`\`\`

2. **Run the setup script**
   \`\`\`bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   source venv/bin/activate
   cd backend
   python manage.py runserver
   \`\`\`

### Manual Setup

1. **Create virtual environment**
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pip install -r backend/requirements.txt
   \`\`\`

3. **Set up database**
   \`\`\`bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   \`\`\`

4. **Create superuser**
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

5. **Load sample data (optional)**
   \`\`\`bash
   python ../scripts/seed_database.py
   \`\`\`

6. **Start development server**
   \`\`\`bash
   python manage.py runserver
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update user profile

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `GET /api/projects/{id}/analytics/` - Project analytics

### Issues
- `GET /api/projects/{project_id}/issues/` - List project issues
- `POST /api/projects/{project_id}/issues/` - Create issue
- `GET /api/issues/{id}/` - Get issue details
- `PUT /api/issues/{id}/` - Update issue
- `DELETE /api/issues/{id}/` - Delete issue
- `POST /api/issues/bulk-update/` - Bulk update issues

### Comments
- `GET /api/issues/{issue_id}/comments/` - List issue comments
- `POST /api/issues/{issue_id}/comments/` - Create comment
- `GET /api/comments/{id}/` - Get comment details
- `PUT /api/comments/{id}/` - Update comment
- `DELETE /api/comments/{id}/` - Delete comment

### Other Endpoints
- `GET /api/dashboard/stats/` - Dashboard statistics
- `GET /api/search/` - Global search
- `GET /api/labels/` - List/create labels
- `GET /api/users/` - List users
- `GET /api/projects/{id}/activities/` - Project activities
- `POST /api/issues/{id}/attachments/` - Upload attachments

## Database Management

### Create Sample Data
\`\`\`bash
python scripts/seed_database.py
\`\`\`

### Backup Database
\`\`\`bash
python scripts/backup_database.py create
\`\`\`

### Restore Database
\`\`\`bash
python scripts/backup_database.py restore backup_20231201_120000.json
\`\`\`

### List Backups
\`\`\`bash
python scripts/backup_database.py list
\`\`\`

### Clean Old Data
\`\`\`bash
python backend/manage.py cleanup_old_data --days=365
\`\`\`

## Admin Interface

Access the Django admin interface at `http://127.0.0.1:8000/admin/` with your superuser credentials.

### Admin Features
- Enhanced project management with member statistics
- Advanced issue filtering and bulk operations
- Comment management with threading support
- Activity tracking and audit logs
- Label management with color coding
- File attachment handling
- User management and permissions

## Development

### Project Structure
\`\`\`
bug-reporting-system/
├── backend/
│   ├── bugreporting/          # Django project settings
│   ├── core/                  # Main application
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   ├── permissions.py    # Custom permissions
│   │   ├── admin.py          # Admin interface
│   │   └── management/       # Management commands
│   └── manage.py
├── scripts/                   # Utility scripts
│   ├── create_database.py    # Database setup
│   ├── seed_database.py      # Sample data generation
│   ├── backup_database.py    # Backup utility
│   └── setup.sh             # Automated setup
└── README.md
\`\`\`

### Key Models
- **Project**: Container for issues with team members
- **Issue**: Bug reports/tasks with status, priority, severity
- **Comment**: Threaded discussions on issues
- **Label**: Categorization tags for issues
- **Activity**: Audit trail of all system actions
- **IssueAttachment**: File uploads for issues

### Custom Management Commands
- `create_sample_data` - Generate test data
- `cleanup_old_data` - Archive old records

## Configuration

### Environment Variables
Create a `.env` file in the backend directory:

\`\`\`env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
\`\`\`

### Production Settings
For production deployment:
1. Set `DEBUG=False`
2. Configure PostgreSQL database
3. Set up proper static file serving
4. Configure email backend for notifications
5. Set up proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the Django admin interface for data management
- Review API documentation at `/api/` endpoint
- Use the global search feature for finding specific issues
- Check activity logs for audit trails

## Changelog

### Version 1.0.0
- Initial release with core functionality
- JWT authentication system
- Project and issue management
- Comment system with threading
- File attachment support
- Admin interface with custom views
- Database backup and restore utilities
- Sample data generation scripts
