# 🚀 CypherBank Production Deployment Guide

## Quick Start (Hackathon Ready!)

### 1. Prerequisites
- Docker & Docker Compose installed
- Git (to clone the repository)

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your database credentials
# Default values are already set for quick testing
```

### 3. Deploy to Production

#### Option A: One-Command Deployment
```bash
# Linux/macOS
./deploy.sh

# Windows
deploy.bat
```

#### Option B: Manual Docker Compose
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Eureka Server  │
│   (React)       │◄───┤   (Spring)      │◄───┤   (Spring)      │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8761    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐
        │User Service  │ │Account Svc  │ │Transaction│
        │Port: 8081    │ │Port: 8082   │ │Port: 8083 │
        └──────────────┘ └─────────────┘ └───────────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                        ┌───────▼───────┐
                        │   MySQL DB    │
                        │   Port: 3306  │
                        └───────────────┘
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 3306 | Database port |
| `DB_USERNAME` | cypherbank | Database username |
| `DB_PASSWORD` | cypherbank123 | Database password |

## 🛠️ Management Commands

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart a specific service
docker-compose -f docker-compose.prod.yml restart user-service

# View logs for a specific service
docker-compose -f docker-compose.prod.yml logs -f frontend

# Scale a service (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale user-service=2
```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service-name

# Check if ports are available
netstat -tulpn | grep :3000
```

### Database Connection Issues
```bash
# Check MySQL container
docker-compose -f docker-compose.prod.yml logs mysql

# Connect to MySQL directly
docker exec -it cypherbank-mysql mysql -u cypherbank -p
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] All services running
- [ ] Frontend accessible
- [ ] API endpoints responding
- [ ] Eureka dashboard showing all services

## 🚀 Ready for Demo!

Your CypherBank application is now production-ready and containerized! Perfect for hackathon demos and deployment to any Docker-compatible environment.


