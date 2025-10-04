#!/bin/bash

echo "🚀 Deploying CypherBank to Production..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Build all services
echo "🔨 Building all services..."
docker-compose -f docker-compose.prod.yml build

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 CypherBank is now running!"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Eureka Dashboard: http://localhost:8761"
echo "   API Gateway: http://localhost:8080"
echo ""
echo "🛑 To stop: docker-compose -f docker-compose.prod.yml down"
echo "📝 To view logs: docker-compose -f docker-compose.prod.yml logs -f"


