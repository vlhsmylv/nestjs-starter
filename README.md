# NestJS Authentication Template

A secure, production-ready authentication template for NestJS applications with comprehensive security features and best practices.

## Template Overview

This template provides a solid foundation for building secure NestJS applications with authentication and user management. It implements industry best practices and security measures out of the box.

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                  # Data Transfer Objects
│   ├── strategies/           # Passport strategies
│   ├── auth.controller.ts    # Auth endpoints
│   ├── auth.module.ts        # Module configuration
│   └── auth.service.ts       # Business logic
├── user/                     # User management module
│   ├── dto/                  # Data Transfer Objects
│   ├── guards/               # Route guards
│   ├── user.controller.ts    # User endpoints
│   ├── user.module.ts        # Module configuration
│   └── user.service.ts       # Business logic
├── app.module.ts             # Main application module
└── main.ts                   # Application entry point

prisma/                       # Database ORM
├── schema.prisma            # Database schema
```

## Security Features

1. **Authentication**

   - JWT-based authentication
   - HTTP-only cookie storage
   - Secure token transmission
   - Cryptographically secure OTP generation

2. **Data Protection**

   - Field-level encryption
   - Password hashing with bcrypt
   - HMAC-based OTP verification
   - Rate limiting

3. **API Security**
   - CORS configuration
   - Input validation
   - Request sanitization
   - Swagger security schemes

## Key Components

### Authentication Module

- Registration with email verification
- Secure login with JWT
- OTP generation and verification
- Password hashing and validation

### User Module

- Profile management
- Password changes
- Account deletion
- Protected routes

### Database

- MongoDB with Prisma ORM
- Encrypted sensitive fields
- Proper indexing
- Type-safe queries

## Getting Started

1. **Prerequisites**

   - Node.js (v14 or later)
   - MongoDB
   - pnpm (`npm install -g pnpm`)

2. **Installation**

   ```bash
   # Clone the template
   git clone <repository-url>
   cd <project-directory>

   # Install dependencies
   pnpm install
   ```

3. **Configuration**
   Update `.env` with your values:

   ```env
   DATABASE_URL="mongodb://localhost:27017/nest-auth"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRATION="7d"
   ENCRYPTION_KEY="32-char-encryption-key-change-in-prod"
   PORT=3000
   ```

4. **Database Setup**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Running the Application**

   ```bash
   # Development
   pnpm dev

   # Production build
   pnpm build
   pnpm start
   ```

## Scripts

```json
{
  "dev": "nest start --watch",
  "build": "nest build",
  "start": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

## API Documentation

Access Swagger documentation at `http://localhost:3000/api`

### Available Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-email` - Verify email with OTP

#### User Management

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `PUT /user/change-password` - Change password
- `DELETE /user/account` - Delete account

## Customization

1. **Email Service Integration**

   - Implement email service in `auth.service.ts`
   - Configure email templates
   - Set up email provider

2. **Additional Security**

   - Add 2FA
   - Implement session management
   - Add IP-based blocking

3. **User Features**
   - Add role-based access
   - Implement social auth
   - Add profile pictures

## Production Considerations

1. **Security**

   - Use strong encryption keys
   - Enable HTTPS
   - Set up proper CORS
   - Configure rate limiting

2. **Database**

   - Set up authentication
   - Configure backups
   - Implement indexing

3. **Monitoring**
   - Set up logging
   - Configure monitoring
   - Implement error tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This template is MIT licensed.
