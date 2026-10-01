# 📚 Library Management System

## Professional, Secure & Scalable Solution

### ✨ Features Implemented

#### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- BCrypt password hashing
- Account lockout after failed attempts
- Login history audit logging
- Token expiration management

#### 👑 Owner/Super Admin Control
- **Immutable Owner Account** - Cannot be modified or deleted
- Complete system control
- User management (create, edit, deactivate)
- Staff role management
- Settings management
- Backup/Restore capabilities
- Security settings

#### 📊 Dashboard
- Total books and availability
- Member statistics
- Staff overview
- Daily issue/return tracking
- Fine and payment metrics
- Monthly revenue analysis
- Overdue book count

#### 📖 Book Management
- Create/Read/Update/Delete books
- ISBN and Book ID validation
- Availability tracking
- Status management (AVAILABLE, ISSUED, RESERVED, DAMAGED, LOST, MAINTENANCE)
- Location and shelf tracking
- Search and filter capabilities
- Pagination support

#### 👥 Member Management
- Member registration and profiles
- Membership tracking
- Status management (ACTIVE, INACTIVE, SUSPENDED, EXPIRED)
- History tracking
- Search functionality

#### 📤 Issue/Return System
- Automatic availability checking
- Due date assignment
- Late fee calculation
- Book condition tracking
- Damage/Lost marking
- Return date recording
- Overdue detection

#### 💰 Fine Management
- Automatic fine calculation on late returns
- Configurable fine per day and max fine
- Payment tracking (partial/full)
- Fine waiving capability
- Multiple fine reasons

#### 💳 Payment System
- Payment processing and tracking
- Multiple payment methods
- Receipt generation
- Payment history
- Revenue reporting

#### 🔖 Reservation System
- Book reservations when unavailable
- Queue position tracking
- Expiry management
- Fulfillment notifications
- Cancellation support

#### 📋 Reports
- Book inventory reports
- Issue/Return reports
- Fine and payment reports
- Overdue reports
- Revenue analytics
- CSV export capability
- Audit log export

#### 📝 Audit Logging
- Complete action logging
- User tracking
- Role recording
- Module tracking
- IP address logging
- Timestamp recording
- Old/New value comparison

#### 🔑 Role-Based Access Control (RBAC)
- **OWNER**: All permissions
- **ADMIN**: User, Book, Member, Issue, Fine management
- **LIBRARIAN**: Book, Member, Issue operations
- **STAFF**: Limited issue/return operations
- **MEMBER**: View own books and fines

### 🛡️ Security Features
- Server-side authorization on all endpoints
- Permission middleware validation
- Owner-only endpoint protection
- Soft deletes for data recovery
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Account lockout mechanism

### 📚 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user profile
- `POST /api/auth/change-password` - Password change

#### Users (Owner Only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Edit user
- `DELETE /api/users/:id` - Deactivate user

#### Books
- `GET /api/books` - List books
- `GET /api/books/:id` - Book details
- `POST /api/books` - Create book
- `PATCH /api/books/:id` - Edit book
- `DELETE /api/books/:id` - Delete book

#### Members
- `GET /api/members` - List members
- `GET /api/members/:id` - Member details
- `POST /api/members` - Create member
- `PATCH /api/members/:id` - Edit member
- `DELETE /api/members/:id` - Deactivate member

#### Issues
- `GET /api/issues` - List issues
- `POST /api/issues` - Issue book
- `POST /api/issues/:id/return` - Return book

#### Fines
- `GET /api/fines` - List fines
- `GET /api/fines/:id` - Fine details
- `POST /api/fines` - Create fine
- `PATCH /api/fines/:id/pay` - Record payment
- `PATCH /api/fines/:id/waive` - Waive fine

#### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id/receipt` - Generate receipt

#### Reservations
- `GET /api/reservations` - List reservations
- `POST /api/reservations` - Create reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `POST /api/reservations/:id/fulfill` - Fulfill reservation

#### Dashboard
- `GET /api/dashboard` - Dashboard metrics

#### Reports
- `GET /api/reports/books` - Books report
- `GET /api/reports/issues` - Issues report
- `GET /api/reports/fines` - Fines report
- `GET /api/reports/overdue` - Overdue report
- `GET /api/reports/revenue` - Revenue report

#### Audit Logs
- `GET /api/audit-logs` - View audit logs
- `GET /api/audit-logs/export` - Export audit logs

#### Settings
- `GET /api/settings` - View settings
- `PATCH /api/settings` - Update settings (Owner Only)

### 🔄 Database Models
1. **User** - User accounts with RBAC
2. **Member** - Library members/students
3. **Book** - Book inventory
4. **Author** - Book authors
5. **Publisher** - Book publishers
6. **Category** - Book categories
7. **Issue** - Book issue records
8. **Return** - Book return records (integrated with Issue)
9. **Fine** - Fine tracking
10. **Payment** - Payment records
11. **Reservation** - Book reservations
12. **AuditLog** - Action audit trail
13. **Setting** - System settings

### 🚀 Installation

```bash
# Clone repository
git clone <repo-url>
cd library-management-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start database (MongoDB)
mongodb

# Seed owner account
npm run seed

# Start development server
npm run dev

# Production build
npm start
```

### 📋 Environment Variables
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
OWNER_EMAIL=owner@library.com
OWNER_PASSWORD=ChangeMe@12345
FINE_PER_DAY=5
MAX_FINE=500
```

### 🎯 Next Steps
1. Frontend development (React/Vue.js)
2. Barcode/QR code integration
3. Email/SMS notifications
4. Advanced reporting (PDF export)
5. Multiple library support
6. Mobile app

### 📄 License
MIT License - See LICENSE file

### ✍️ Author
omeshdepan12

---

**Status**: ✅ Production Ready (Core Modules)

