# ♻️ Smart Plastic Recycling System

A full-stack web application that incentivizes plastic recycling through a points-based reward system. Users can submit plastic waste contributions, earn points, and redeem rewards while administrators manage the system and generate reports.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Real-time Features](#real-time-features)
- [Reports & Analytics](#reports--analytics)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 👤 User Features
- **User Authentication** - Register, login, and password reset functionality
- **Contribution Submission** - Submit plastic waste with images and location tracking
- **Points System** - Earn points based on plastic type and quantity
- **Reward Tiers** - Bronze, Silver, Gold, and Platinum tiers based on points
- **Dashboard** - View personal statistics, charts, and contribution history
- **Profile Management** - Update personal information and password

### 👑 Admin Features
- **Admin Dashboard** - Real-time statistics and analytics
- **User Management** - View, update, and manage user accounts
- **Contribution Management** - Approve or reject user submissions
- **Reports Generation** - Generate CSV, Excel, and PDF reports
- **Analytics Charts** - Monthly trends, plastic type distribution, and user rankings
- **Real-time Updates** - Live notifications via WebSocket

### 📊 Key Metrics Tracked
- Total users and active contributors
- Total weight of recycled plastic (kg)
- Points earned and redeemed
- Plastic type distribution (PET, HDPE, PVC, LDPE, PP, PS)
- Monthly contribution trends
- User rankings and performance

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Upload**: Multer with Sharp image optimization
- **Email**: Nodemailer
- **Reporting**: PDFKit, ExcelJS, json2csv

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Icons**: React Icons

## 🏗 Architecture

```
smart-plastic-recycling-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── user/      # User pages
│   │   │   └── auth/      # Authentication pages
│   │   ├── services/      # API service layer
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
└── server/                 # Node.js backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Mongoose models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── utils/         # Helper functions
    │   ├── socket/        # WebSocket configuration
    │   └── scripts/       # Utility scripts
    ├── uploads/           # Uploaded images
    └── logs/              # Application logs
```

## 📥 Installation

### Prerequisites
- Node.js (v22 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/BNesttech2000/smart-plastic-recycling-system.git
cd smart-plastic-recycling-system
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

Create `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Use your actual credentials in .env (never commit this file)
MONGO_URI=mongodb://localhost:27017/smart_plastic_recycling

# For MongoDB Atlas (replace with your actual credentials in .env):
# MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster.mongodb.net/smart_plastic_recycling

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_16_characters

# Client URL
CLIENT_URL=http://localhost:3000

# Upload Limits
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg
```

### Frontend Environment Variables (.env)

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Plastic Recycling System
VITE_APP_VERSION=1.0.0
VITE_SOCKET_URL=http://localhost:5000
```

### Database Indexes (For Performance)

Run these in MongoDB shell after first start:

```javascript
// PlasticContributions indexes
db.plasticcontributions.createIndex({ status: 1, createdAt: -1 });
db.plasticcontributions.createIndex({ user: 1, createdAt: -1 });
db.plasticcontributions.createIndex({ plasticType: 1 });
db.plasticcontributions.createIndex({ createdAt: -1 });

// Users indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ totalPoints: -1 });
db.users.createIndex({ totalContributions: -1 });
db.users.createIndex({ role: 1, isActive: 1, createdAt: -1 });
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

Server will run at: `http://localhost:5000`

### Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will run at: `http://localhost:3000`

### Default Admin Credentials

After first run, create an admin user:

```bash
cd server
node src/scripts/createAdmin.js
```

**Default Login:**
- Email: `admin@recycling.com`
- Password: `Admin@123`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/forgot-password` | Send reset email |
| PUT | `/api/users/reset-password/:token` | Reset password |

### Contribution Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contributions` | Submit contribution |
| GET | `/api/contributions` | Get all contributions (admin) |
| GET | `/api/contributions/statistics` | Dashboard statistics |
| PUT | `/api/contributions/:id/status` | Approve/reject contribution |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |

### Report Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Generate new report |
| GET | `/api/reports/:id/download` | Download report |
| DELETE | `/api/reports/:id` | Delete report |

### Chart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/charts/monthly-trends` | Monthly contribution trends |
| GET | `/api/charts/category-comparison` | Plastic type comparison |
| GET | `/api/charts/user-ranking` | User rankings |

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: { type: String, enum: ['user', 'admin'] },
  totalPoints: Number,
  totalWeight: Number,
  totalContributions: Number,
  rewardTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  isActive: Boolean,
  lastContribution: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

### Plastic Contribution Model

```javascript
{
  user: ObjectId (ref: User),
  plasticType: { type: String, enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'] },
  quantity: Number,
  unit: String,
  pointsEarned: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'] },
  collectionPoint: String,
  images: [{ url: String, uploadedAt: Date }],
  location: { type: Point, coordinates: [Number] },
  approvedBy: ObjectId,
  approvedDate: Date,
  rejectionReason: String
}
```

## 🔌 Real-time Features

The system uses Socket.IO for real-time updates:

- **New Contribution Notifications** - Admins receive instant notifications when users submit contributions
- **Status Updates** - Real-time updates when contributions are approved/rejected
- **Dashboard Stats** - Live updates to dashboard statistics

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-admin` | Client → Server | Admin joins room for updates |
| `new-contribution` | Server → Client | New contribution submitted |
| `contribution-updated` | Server → Client | Contribution status changed |
| `stats-updated` | Server → Client | Dashboard statistics updated |

## 📈 Reports & Analytics

### Supported Report Formats
- **JSON** - Machine-readable data
- **CSV** - Spreadsheet compatible
- **Excel (XLSX)** - Microsoft Excel format
- **PDF** - Printable reports

### Report Types
- **Daily Summary** - Day-by-day breakdown
- **Weekly Trends** - Weekly analysis
- **Monthly Performance** - Monthly statistics
- **Quarterly Review** - Quarterly analysis
- **Yearly Report** - Annual summary
- **Custom Range** - User-defined date range

### Export Features
- Export contributions to CSV/Excel
- Export user data to CSV
- Generate PDF reports with charts
- Email reports to stakeholders

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Error
```
Error: MongooseServerSelectionError
```
**Solution:** Check MongoDB is running:
```bash
# Local MongoDB
mongod --version

# Atlas - check network access in MongoDB Atlas console
```

#### 2. JWT Token Error
```
Error: JsonWebTokenError
```
**Solution:** Clear localStorage and login again:
```javascript
localStorage.clear();
window.location.reload();
```

#### 3. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process on port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

#### 4. Upload Permission Error
```
Error: EACCES: permission denied
```
**Solution:** Create uploads directory with proper permissions:
```bash
cd server
mkdir -p uploads/contributions
chmod 755 uploads/contributions
```

#### 5. WebSocket Connection Failed
**Solution:** This is non-critical. The app falls back to HTTP polling. To fix, ensure Socket.IO is properly configured in both client and server.

### Performance Optimization

The dashboard loads in **1-2 seconds** (down from 8-13 seconds) due to:
- Parallel database queries with `Promise.all`
- MongoDB indexes on frequently queried fields
- Data limiting (top 5 contributors, last 5 activities)
- Lean queries to avoid Mongoose document overhead

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Update documentation for new features
- Add tests for critical functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Plastic type classification standards
- MongoDB Atlas for database hosting
- All contributors and recyclers making a difference

## 📧 Contact

- **Developer**: Gift Lubinda
- **Email**: info@smartrecycle.com
- **Phone**: +260 975 692353
- **Location**: Lusaka, Zambia

---

## 🎯 Quick Start Commands

```bash
# Clone and install
git clone https://github.com/BNesttech2000/smart-plastic-recycling-system.git
cd smart-plastic-recycling-system

# Backend setup
cd server
npm install
cp .env.example .env  # Configure your environment
npm run dev

# Frontend setup (new terminal)
cd client
npm install
npm run dev

# Create admin user
cd server
node src/scripts/createAdmin.js
```

## 🚀 Deployment

### Deploy Backend to Render/Vercel
```bash
# Add to package.json scripts
"start": "node src/server.js",
"build": "npm install"
```

### Deploy Frontend to Netlify/Vercel
```bash
# Build command
npm run build

# Output directory
dist/
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=strong_secret_key
CLIENT_URL=https://yourdomain.com
```

## 🔐 Security Notes

- **Never commit** `.env` files or credentials to version control
- Always use environment variables for sensitive data
- The `.env.example` file is safe to commit as it contains only placeholders
- Rotate your JWT secret and database passwords regularly

---

**Built with ❤️ for a cleaner environment** ♻️
```

## ✅ Changes made:

1. **Fixed the MongoDB Atlas line** - Now uses `<db_username>:<db_password>` placeholders
2. **Added Security Notes section** - Reminds users not to commit credentials
3. **Updated GitHub URL** - Changed to your actual repository
4. **Added placeholder comments** - Makes it clear what should be replaced
5. **Added .env.example reference** - Encourages best practices

## 🚀 Now commit the updated README:

```bash
# Replace the current README with this one
# Save the content above to README.md

# Then commit and push
git add README.md
git commit -m "docs: Update README with secure placeholders and best practices"
git push origin main
```

**Built with ❤️ for a cleaner environment** ♻️
```
