# 🏦 CypherBank - Microservices Banking Application

A modern, full-stack banking application built with Spring Boot microservices and React frontend, designed for hackathons and production deployment.

## 🌟 Features

- **👤 User Management**: Registration, authentication, and user profiles
- **💳 Account Management**: Multiple account types (Checking, Savings, Transfer)
- **💰 Banking Operations**: Deposits, withdrawals, and transfers
- **📊 Transaction History**: Complete transaction tracking with user-friendly display
- **🔐 Security**: Environment-based configuration and secure data handling
- **📱 Modern UI**: Responsive React frontend with Material-UI components
- **🐳 Containerized**: Ready for Docker deployment

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

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- MySQL 8.0+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CypherBank
   ```

2. **Start the application**
   ```bash
   # Windows
   start-cypherbank.bat
   
   # Linux/macOS
   ./start-services.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Eureka Dashboard: http://localhost:8761
   - API Gateway: http://localhost:8080

### Production Deployment

1. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

2. **Deploy with Docker**
   ```bash
   # One-command deployment
   ./deploy.sh  # Linux/macOS
   deploy.bat   # Windows
   ```

## 📁 Project Structure

```
CypherBank/
├── eureka-server/          # Service Discovery
├── api-gateway/            # API Gateway
├── user-service/           # User Management
├── account-service/        # Account Management
├── transaction-service/    # Transaction Processing
├── frontend/               # React Frontend
├── docker-compose.prod.yml # Production Docker setup
├── deploy.sh              # Linux/macOS deployment
├── deploy.bat             # Windows deployment
├── env.example            # Environment variables template
└── DEPLOYMENT.md          # Detailed deployment guide
```

## 🛠️ Technologies Used

### Backend
- **Spring Boot** - Microservices framework
- **Spring Cloud** - Service discovery and API gateway
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **Maven** - Build tool

### Frontend
- **React** - Frontend framework
- **Material-UI** - UI components
- **Axios** - HTTP client
- **Node.js** - Runtime environment

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Environment Variables** - Configuration management

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 3306 | Database port |
| `DB_USERNAME` | root | Database username |
| `DB_PASSWORD` | password | Database password |

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Main API endpoint |
| User Service | 8081 | User management |
| Account Service | 8082 | Account operations |
| Transaction Service | 8083 | Transaction processing |

## 📊 API Endpoints

### User Service
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Account Service
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/user/{userId}` - Get user accounts
- `POST /api/accounts` - Create account
- `POST /api/accounts/{id}/deposit` - Deposit money
- `POST /api/accounts/{id}/withdraw` - Withdraw money
- `POST /api/accounts/transfer` - Transfer between accounts

### Transaction Service
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/user/{userId}` - Get user transactions
- `GET /api/transactions/user/{userId}/with-emails` - Get transactions with user emails
- `POST /api/transactions` - Create transaction

## 🎯 Key Features Implemented

### ✅ User Management
- User registration and authentication
- Role-based access (USER, ADMIN)
- User profile management

### ✅ Account Management
- Multiple account types (Checking, Savings, Transfer)
- Account creation and management
- Balance tracking

### ✅ Banking Operations
- Deposit money to accounts
- Withdraw money from accounts
- Transfer money between accounts
- Real-time balance updates

### ✅ Transaction System
- Complete transaction logging
- Transaction history with user emails
- Transaction status tracking
- Proper transaction display (positive/negative amounts)

### ✅ Modern UI
- Responsive design
- Material-UI components
- Dark mode support
- Interactive account cards
- Real-time transaction display

## 🐛 Troubleshooting

### Common Issues

1. **Services won't start**
   - Check if ports are available
   - Verify Java, Maven, and Node.js are installed
   - Check database connection

2. **Database connection errors**
   - Verify MySQL is running
   - Check database credentials in .env file
   - Ensure database exists

3. **Frontend not loading**
   - Check if all backend services are running
   - Verify API Gateway is accessible
   - Check browser console for errors

### Debug Commands

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart a service
docker-compose -f docker-compose.prod.yml restart service-name
```

## 🚀 Deployment Options

### Local Development
- Use `start-cypherbank.bat` or `start-services.sh`
- Perfect for development and testing

### Production (Docker)
- Use `docker-compose.prod.yml`
- Environment variables for configuration
- Persistent data storage
- Health checks and restart policies

### Cloud Deployment
- Compatible with AWS, Azure, GCP
- Use provided Docker Compose configuration
- Scale services as needed

## 📝 Development Notes

- All services use environment variables for configuration
- Database credentials are externalized
- Services are containerized for easy deployment
- Frontend and backend are properly integrated
- Transaction system includes proper user email display

## 🎉 Hackathon Ready!

This application is perfect for hackathon demos:
- ✅ One-command deployment
- ✅ Production-ready architecture
- ✅ Modern, responsive UI
- ✅ Complete banking functionality
- ✅ Professional documentation

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the DEPLOYMENT.md file
3. Check service logs for errors

---

**Built with ❤️ for hackathons and production deployment**