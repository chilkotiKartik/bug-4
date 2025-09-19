#!/bin/bash

echo " Setting up Bug Reporting System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed."
    exit 1
fi

print_status "Setting up Backend (Django)..."

# Backend setup
cd backend

# Create virtual environment
print_status "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Setup environment file
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp .env.example .env
    print_warning "Please edit backend/.env with your configuration"
fi

# Run migrations
print_status "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
read -p "Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Creating superuser..."
    python manage.py createsuperuser
fi

cd ..

print_status "Setting up Frontend (Next.js)..."

# Frontend setup
# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Setup environment file
if [ ! -f .env.local ]; then
    print_status "Creating .env.local file..."
    cp frontend/.env.local.example .env.local
    print_warning "Please edit .env.local with your configuration"
fi

print_status "✅ Setup complete!"
echo
echo "To start the development servers:"
echo "1. Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: npm run dev"
echo
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:3000"
echo "API Documentation: http://localhost:8000/api/docs/"
