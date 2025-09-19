#!/bin/bash

# Bug Reporting System Setup Script
echo "Bug Reporting System - Setup Script"
echo "===================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is required but not installed."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Set up database
echo "Setting up database..."
cd backend
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser account..."
echo "Please enter superuser details:"
python manage.py createsuperuser

# Load sample data
echo "Would you like to load sample data? (y/n)"
read -r load_sample
if [[ $load_sample =~ ^[Yy]$ ]]; then
    echo "Loading sample data..."
    python ../scripts/seed_database.py
fi

echo ""
echo "Setup completed successfully!"
echo ""
echo "To start the development server:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Navigate to backend directory: cd backend"
echo "3. Start the server: python manage.py runserver"
echo ""
echo "The admin interface will be available at: http://127.0.0.1:8000/admin/"
echo "The API will be available at: http://127.0.0.1:8000/api/"
