#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to start backend
start_backend() {
    print_status "Starting Django backend..."
    cd backend
    source venv/bin/activate
    python manage.py runserver &
    BACKEND_PID=$!
    cd ..
    echo $BACKEND_PID > .backend.pid
}

# Function to start frontend
start_frontend() {
    print_status "Starting Next.js frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > .frontend.pid
}

# Function to cleanup processes
cleanup() {
    print_status "Shutting down servers..."
    if [ -f .backend.pid ]; then
        kill $(cat .backend.pid) 2>/dev/null
        rm .backend.pid
    fi
    if [ -f .frontend.pid ]; then
        kill $(cat .frontend.pid) 2>/dev/null
        rm .frontend.pid
    fi
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

print_status "🚀 Starting Bug Reporting System..."

# Start both servers
start_backend
sleep 3
start_frontend

print_status "✅ Both servers are starting..."
echo
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/api/docs/"
echo
print_warning "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
