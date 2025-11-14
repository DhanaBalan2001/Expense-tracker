# 💰 Smart Expense Tracker

<div align="center">

![Expense Tracker](https://img.shields.io/badge/Expense-Tracker-blue?style=for-the-badge&logo=wallet&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**🚀 A comprehensive, feature-rich expense management platform built with modern web technologies**

[Live Demo](https://expense-tracker-dhanabalan.netlify.app) • [API Documentation](#api-documentation) • [Features](#features) • [Installation](#installation)

</div>

---

## 🌟 Overview

Smart Expense Tracker is a full-stack web application designed to revolutionize personal finance management. Built with cutting-edge technologies, it offers an intuitive interface for tracking expenses, managing budgets, setting financial goals, and generating insightful reports.

### ✨ Key Highlights

- 🎯 **Smart Dashboard** - Real-time financial insights with interactive charts
- 📊 **Advanced Analytics** - Monthly trends and category-wise expense analysis
- 🎯 **Goal Management** - Set and track financial objectives
- 🔄 **Recurring Expenses** - Automated tracking for subscription services
- 👥 **Shared Expenses** - Collaborative expense management for groups
- 📈 **Comprehensive Reports** - Export data in PDF and Excel formats
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Seamless experience across all devices

---

## 🚀 Features

### 💼 Core Functionality
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Budget Planning**: Set monthly/yearly budgets with real-time tracking
- **Financial Goals**: Create and monitor savings targets
- **Recurring Transactions**: Automate subscription and bill tracking
- **Shared Expenses**: Split bills and track group expenses

### 📊 Analytics & Reporting
- **Interactive Charts**: Category-wise expense distribution
- **Monthly Trends**: Visual representation of spending patterns
- **Export Options**: Generate PDF and Excel reports
- **Real-time Insights**: Live dashboard with key metrics

### 🔧 Advanced Features
- **User Profiles**: Customizable user settings and preferences
- **Data Security**: Encrypted password storage with bcrypt
- **API Documentation**: Comprehensive REST API documentation
- **Responsive UI**: Bootstrap-powered responsive design
- **Toast Notifications**: Real-time user feedback

---

## 🛠️ Technology Stack

### Frontend
```
React 19.0.0          - Modern UI library with latest features
Vite 6.2.0           - Lightning-fast build tool
React Router 7.3.0    - Client-side routing
Bootstrap 5.3.3       - Responsive CSS framework
Chart.js 4.4.8        - Interactive data visualization
React-ChartJS-2       - React wrapper for Chart.js
Axios 1.8.3          - HTTP client for API calls
FontAwesome          - Icon library
React-Toastify       - Notification system
```

### Backend
```
Node.js              - JavaScript runtime
Express.js 4.21.2    - Web application framework
MongoDB 8.12.1       - NoSQL database
Mongoose             - MongoDB object modeling
JWT 9.0.2           - JSON Web Token authentication
bcrypt 5.1.1        - Password hashing
CORS 2.8.5          - Cross-origin resource sharing
```

### Development & Deployment
```
ESLint 9.21.0       - Code linting and formatting
Vite                - Development server and bundler
Netlify             - Frontend deployment platform
dotenv              - Environment variable management
```

### Document Generation
```
PDFKit 0.16.0       - PDF generation library
ExcelJS 4.4.0       - Excel file generation
```

---

## 📁 Project Structure

```
expense-tracker/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── categoryChart/     # Expense category visualization
│   │   │   ├── expensesummary/    # Financial summary widget
│   │   │   ├── monthlyTrends/     # Monthly spending trends
│   │   │   ├── navbar/            # Navigation component
│   │   │   ├── recentTransactions/ # Recent activity display
│   │   │   └── sidebar/           # Navigation sidebar
│   │   ├── pages/         # Application pages
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   ├── expenses/          # Expense management
│   │   │   ├── budget/            # Budget planning
│   │   │   ├── goals/             # Financial goals
│   │   │   ├── reports/           # Analytics & reports
│   │   │   ├── recurringExpenses/ # Subscription tracking
│   │   │   ├── sharedExpenses/    # Group expense management
│   │   │   ├── profile/           # User profile
│   │   │   └── settings/          # Application settings
│   │   ├── services/      # API service layer
│   │   └── config/        # Configuration files
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend application
│   ├── controllers/       # Business logic handlers
│   ├── models/           # MongoDB data models
│   ├── routes/           # API route definitions
│   ├── middleware/       # Custom middleware functions
│   └── package.json      # Backend dependencies
└── netlify.toml          # Deployment configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Environment Configuration**
Create `.env` file in server directory:
```env
MONGODB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **Frontend Setup**
```bash
cd ../client
npm install
```

5. **Start Development Servers**

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run dev
```

6. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/api/docs`

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Expenses
- `GET /api/expenses` - Fetch user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budget Management
- `GET /api/budgets` - Fetch user budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget

### Goals & Reports
- `GET /api/goals` - Fetch financial goals
- `POST /api/goals` - Create new goal
- `GET /api/reports/export` - Generate reports

---

## 🎨 Screenshots

### Dashboard
<img width="1920" height="969" alt="Smart Dashboard with Real-time Analytics" src="https://github.com/user-attachments/assets/52bcc97d-7912-48ed-8210-8a3ffca00749" />

### Expense Management
<img width="1920" height="966" alt="Comprehensive Expense Management" src="https://github.com/user-attachments/assets/bef08190-bcb3-4518-99d7-f813d5baf90c" />

### Analytics & Reports
<img width="1920" height="967" alt="Advanced Analytics & Reporting" src="https://github.com/user-attachments/assets/d36269cc-1b73-4fb9-85d6-329dd7854593" />

---

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
MONGODB=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

**Client (Vite Configuration)**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

---

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy to Netlify using the `netlify.toml` configuration
3. Set environment variables in Netlify dashboard

### Backend (Your Choice)
- **Heroku**: Use the included `Procfile`
- **Railway**: Direct GitHub integration
- **DigitalOcean**: App Platform deployment
- **AWS**: EC2 or Elastic Beanstalk

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **Bootstrap** for responsive design components
- **MongoDB** for flexible data storage
- **React** community for excellent ecosystem
- **Netlify** for seamless deployment

---

## 📞 Support

For support, email support@expensetracker.com or join our Slack channel.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
