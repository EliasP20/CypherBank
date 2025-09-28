@echo off
echo 🚀 Deploying CypherBank to Production...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please copy env.example to .env and configure it.
    pause
    exit /b 1
)

REM Build all services
echo 🔨 Building all services...
docker-compose -f docker-compose.prod.yml build

REM Start services
echo 🚀 Starting services...
docker-compose -f docker-compose.prod.yml up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...
docker-compose -f docker-compose.prod.yml ps

echo.
echo 🎉 CypherBank is now running!
echo.
echo 📱 Access Points:
echo    Frontend: http://localhost:3000
echo    Eureka Dashboard: http://localhost:8761
echo    API Gateway: http://localhost:8080
echo.
echo 🛑 To stop: docker-compose -f docker-compose.prod.yml down
echo 📝 To view logs: docker-compose -f docker-compose.prod.yml logs -f
echo.
pause

