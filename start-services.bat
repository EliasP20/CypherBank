@echo off
echo 🏦 Starting CypherBank Microservices Application...

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Add Maven to PATH
set PATH=%PATH%;%USERPROFILE%\maven\apache-maven-3.9.11\bin

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven is not installed. Please install Maven 3.6 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ All prerequisites are installed

REM Create logs directory
if not exist logs mkdir logs

REM Build all services
echo 🔨 Building all services...
call mvn clean package -DskipTests

REM Start services
echo 🚀 Starting services...

REM Start Eureka Server
echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"

REM Wait for Eureka to start
echo ⏳ Waiting for Eureka Server to start...
timeout /t 30 /nobreak >nul

REM Start API Gateway
echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

REM Start User Service
echo Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

REM Start Account Service
echo Starting Account Service...
start "Account Service" cmd /k "cd account-service && mvn spring-boot:run"

REM Start Transaction Service
echo Starting Transaction Service...
start "Transaction Service" cmd /k "cd transaction-service && mvn spring-boot:run"

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm install && npm start"

echo.
echo 🎉 CypherBank is now running!
echo.
echo 📱 Access Points:
echo    Frontend: http://localhost:3000
echo    Eureka Dashboard: http://localhost:8761
echo    API Gateway: http://localhost:8080
echo.
echo 📊 Service Status:
echo    Eureka Server: http://localhost:8761
echo    User Service: http://localhost:8081
echo    Account Service: http://localhost:8082
echo    Transaction Service: http://localhost:8083
echo.
echo 🛑 Close the individual command windows to stop services
echo.
pause


