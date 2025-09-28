@echo off
echo Starting CYPHERBANK Microservices...
echo.

echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting Account Service...
start "Account Service" cmd /k "cd account-service && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting Transaction Service...
start "Transaction Service" cmd /k "cd transaction-service && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo All CYPHERBANK services are starting up...
echo.
echo Access points:
echo - CYPHERBANK Frontend: http://localhost:3000
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo.
echo Please wait for all services to fully start before using CYPHERBANK.
echo.
pause
