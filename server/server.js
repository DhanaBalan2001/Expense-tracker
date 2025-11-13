import express from 'express';
import dotenv from 'dotenv';
import pkg from 'mongoose';
const { connect, connection: _connection } = pkg;
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import expenseRoutes from './routes/expense.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/report.js';
import goalRoutes from './routes/goal.js';
import recurringRoutes from './routes/recurring.js';
import sharedExpenseRoutes from './routes/sharedexpense.js';
import { EventEmitter } from 'events';
import { errorHandler } from './middleware/error.js';
import budgetRoutes from './routes/budget.js';
import profileRoutes from './routes/profile.js';
import settingsRoutes from './routes/settings.js';
import apiDocsRoutes from './routes/docs.js';


process.setMaxListeners(15);
EventEmitter.defaultMaxListeners = 15;

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());

// MongoDB connection
if (!process.env.MONGODB) {
    console.error('MONGODB environment variable is not set');
    process.exit(1);
}

connect(process.env.MONGODB)
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
});

const connection = _connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Serve API documentation at root URL
app.get('/', (req, res) => {
    res.redirect('/api/docs');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/shared', sharedExpenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/docs', apiDocsRoutes);

app.use(errorHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`Documentation available at http://localhost:${port}/api/docs`);
});
