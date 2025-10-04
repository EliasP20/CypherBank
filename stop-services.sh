#!/bin/bash

echo "🛑 Stopping CypherBank Services..."

# Function to kill process by PID file
kill_service() {
    if [ -f "logs/$1.pid" ]; then
        PID=$(cat logs/$1.pid)
        if ps -p $PID > /dev/null; then
            echo "Stopping $1 (PID: $PID)..."
            kill $PID
            rm logs/$1.pid
        else
            echo "$1 is not running"
            rm logs/$1.pid
        fi
    else
        echo "No PID file found for $1"
    fi
}

# Stop all services
kill_service "frontend"
kill_service "transaction-service"
kill_service "account-service"
kill_service "user-service"
kill_service "api-gateway"
kill_service "eureka-server"

echo "✅ All services have been stopped"
echo "📝 Logs are still available in the logs/ directory"





