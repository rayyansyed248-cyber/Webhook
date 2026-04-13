<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Webhook Project (NestJS)

A robust backend service built with [NestJS](https://github.com/nestjs/nest) for handling webhooks, processing data, and interacting with a PostgreSQL database.

## 🚀 Technologies & Features

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [TypeORM](https://typeorm.io/)
- **Logging**: Highly configurable logging using [Winston](https://github.com/winstonjs/winston) & `nest-winston`
- **Email Services**: Integrated mailing support via [Nodemailer](https://nodemailer.com/)
- **Health Checks**: Built-in system monitoring using `@nestjs/terminus`
- **Testing**: Jest & Supertest for Unit and E2E testing
- **Formatting & Linting**: Prettier & ESLint strictly integrated

## 📦 Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

## 🛠️ Installation

```bash
# Clone the repository (if applicable)
git clone <your-repository-url>

# Navigate into the project directory
cd webhook-project

# Install dependencies
npm install
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory and configure your environment variables. Example:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=webhook_db

# App Configuration
PORT=3000
```

## ▶️ Running the Application

```bash
# Development mode
npm run start

# Watch mode (Recommended for development)
npm run start:dev

# Production mode
npm run start:prod
```

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 🏗️ Building for Production

To build the application for deployment into the `dist` directory:
```bash
npm run build
```

## 🤝 Contributing

Contributions are always welcome. 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is [UNLICENSED](LICENSE).
