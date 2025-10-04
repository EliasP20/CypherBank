#!/bin/bash

echo "🏦 Starting CypherBank Microservices Application..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ All prerequisites are installed"

# Build all services
echo "🔨 Building all services..."
mvn clean package -DskipTests

# Start services in background
echo "🚀 Starting services..."

# Start Eureka Server
echo "Starting Eureka Server..."
cd eureka-server
mvn spring-boot:run > ../logs/eureka-server.log 2>&1 &
EUREKA_PID=$!
cd ..

# Wait for Eureka to start
echo "⏳ Waiting for Eureka Server to start..."
sleep 30

# Start API Gateway
echo "Starting API Gateway..."
cd api-gateway
mvn spring-boot:run > ../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
cd ..

# Start User Service
echo "Starting User Service..."
cd user-service
mvn spring-boot:run > ../logs/user-service.log 2>&1 &
USER_PID=$!
cd ..

# Start Account Service
echo "Starting Account Service..."
cd account-service
mvn spring-boot:run > ../logs/account-service.log 2>&1 &
ACCOUNT_PID=$!
cd ..

# Start Transaction Service
echo "Starting Transaction Service..."
cd transaction-service
mvn spring-boot:run > ../logs/transaction-service.log 2>&1 &
TRANSACTION_PID=$!
cd ..

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm install
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs for cleanup
echo $EUREKA_PID > logs/eureka-server.pid
echo $GATEWAY_PID > logs/api-gateway.pid
echo $USER_PID > logs/user-service.pid
echo $ACCOUNT_PID > logs/account-service.pid
echo $TRANSACTION_PID > logs/transaction-service.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "🎉 CypherBank is now running!"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Eureka Dashboard: http://localhost:8761"
echo "   API Gateway: http://localhost:8080"
echo ""
echo "📊 Service Status:"
echo "   Eureka Server: http://localhost:8761"
echo "   User Service: http://localhost:8081"
echo "   Account Service: http://localhost:8082"
echo "   Transaction Service: http://localhost:8083"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo ""
echo "🛑 To stop all services, run: ./stop-services.sh"
echo ""

# Keep script running
wait





