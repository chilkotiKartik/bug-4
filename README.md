
# 🐞 Bug Reporting System

A comprehensive full-stack bug tracking and project management system built for AI4Bharat's developer assignment. This application enables teams to efficiently create projects, report issues, track progress, and collaborate through an intuitive web interface.

---

## 🌐 Live Demo
Frontend: [Bug Reporting System](https://bug-4.vercel.app/)

---

## 🏗️ Architecture Overview
This is a full-stack application with:

- **Backend**: Django REST Framework with PostgreSQL  
- **Frontend**: Next.js with TypeScript and Tailwind CSS  
- **Authentication**: JWT-based authentication system  
- **Database**: PostgreSQL with optimized queries  
- **Deployment**: Docker containerization support  

---

## 🚀 Features

### Core Functionality
- ✅ **Project Management**: Create and manage multiple projects  
- 🐛 **Issue Tracking**: Comprehensive bug reporting with status and priority management  
- 👥 **Team Collaboration**: Real-time comments and team assignment  
- 🔐 **Authentication**: Secure JWT-based user authentication  
- 📊 **Advanced Analytics**: Comprehensive dashboards and insights  
- 🔍 **Smart Filtering**: Filter issues by status, priority, and keywords  
- 📱 **Responsive Design**: Mobile-friendly interface  

### Advanced Features
- 🤖 **AI-Powered Categorization**: Smart issue classification  
- 🚀 **Real-time Updates**: Live notifications and status changes  
- 📈 **Performance Metrics**: SLA tracking and team productivity insights  
- 🔒 **Enterprise Security**: Role-based access control  
- 🎨 **Modern UI**: Built with shadcn/ui components  

---

## 📋 Technical Requirements Met

### Backend (Django REST Framework)
- **Models**: User, Project, Issue, Comment with proper relationships  
- **API Endpoints**: RESTful APIs for all CRUD operations  
- **Authentication**: JWT login & registration  
- **Permissions**: Role-based access control (only reporters/assignees can update issues)  
- **Query Optimization**: Uses `select_related` / `prefetch_related` for efficient DB queries  

---

## ⚙️ Installation

### Quick Setup (Recommended)
```bash
git clone <repository-url>
cd bug-reporting-system
chmod +x scripts/setup.sh
./scripts/setup.sh
````

### Manual Setup

```bash
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 📡 API Endpoints

### Authentication

* `POST /api/auth/register/` – User registration
* `POST /api/auth/login/` – User login
* `POST /api/auth/logout/` – User logout
* `POST /api/auth/refresh/` – Refresh JWT token
* `GET /api/auth/profile/` – Get user profile
* `PUT /api/auth/profile/update/` – Update user profile

### Projects

* `GET /api/projects/` – List projects
* `POST /api/projects/` – Create project
* `GET /api/projects/{id}/` – Project details
* `PUT /api/projects/{id}/` – Update project
* `DELETE /api/projects/{id}/` – Delete project
* `GET /api/projects/{id}/analytics/` – Project analytics

### Issues

* `GET /api/projects/{project_id}/issues/` – List issues
* `POST /api/projects/{project_id}/issues/` – Create issue
* `GET /api/issues/{id}/` – Issue details
* `PUT /api/issues/{id}/` – Update issue
* `DELETE /api/issues/{id}/` – Delete issue
* `POST /api/issues/bulk-update/` – Bulk update issues

### Comments

* `GET /api/issues/{issue_id}/comments/` – List comments
* `POST /api/issues/{issue_id}/comments/` – Create comment
* `GET /api/comments/{id}/` – Comment details
* `PUT /api/comments/{id}/` – Update comment
* `DELETE /api/comments/{id}/` – Delete comment

### Other

* `GET /api/dashboard/stats/` – Dashboard statistics
* `GET /api/search/` – Global search
* `GET /api/labels/` – List/create labels
* `GET /api/users/` – List users
* `GET /api/projects/{id}/activities/` – Project activities
* `POST /api/issues/{id}/attachments/` – Upload attachments

---

## 🛠️ Database Management

### Create Sample Data

```bash
python scripts/seed_database.py
```

### Backup Database

```bash
python scripts/backup_database.py create
```

### Restore Database

```bash
python scripts/backup_database.py restore backup_20231201_120000.json
```

### List Backups

```bash
python scripts/backup_database.py list
```

### Clean Old Data

```bash
python backend/manage.py cleanup_old_data --days=365
```

---

## 🔑 Admin Interface

Access the Django admin at:
👉 [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

### Admin Features

* Enhanced project management with member statistics
* Advanced issue filtering and bulk operations
* Comment management with threading support
* Activity tracking and audit logs
* Label management with color coding
* File attachment handling
* User management and permissions

---

## 📂 Project Structure

```
bug-reporting-system/
├── backend/
│   ├── bugreporting/     # Django project settings
│   ├── core/             # Main application
│   │   ├── models.py     # Database models
│   │   ├── views.py      # API views
│   │   ├── serializers.py# DRF serializers
│   │   ├── permissions.py# Custom permissions
│   │   ├── admin.py      # Admin interface
│   │   └── management/   # Management commands
│   └── manage.py
├── scripts/              # Utility scripts
│   ├── create_database.py
│   ├── seed_database.py
│   ├── backup_database.py
│   └── setup.sh
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Production Settings

* `DEBUG=False`
* Configure PostgreSQL
* Set up static file serving
* Configure email backend for notifications
* Enable proper logging

---

## 🤝 Contributing

* Fork the repository
* Create a feature branch
* Make your changes
* Add tests if applicable
* Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## ✨ Credits

Made by **Kartik Chilkoti**

💌 For contributions, contact: **[chilkotikartik@gmail.com](mailto:chilkotikartik@gmail.com)**

```

Would you like me to also add a **Contributors section** (so people who contribute can be listed automatically in the README), or just keep the single credit line?
```
