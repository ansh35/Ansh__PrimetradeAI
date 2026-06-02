import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import v1Routes from './routes/v1Router.js';
import { setupSwagger } from './config/swagger.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Swagger Documentation
setupSwagger(app);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Versioning
app.use('/api/v1', v1Routes);

// Backward compatibility (optional, but requested to preserve where possible)
app.use('/api', v1Routes); 

app.get('/api', (req, res) => res.json({
  success: true,
  message: 'TaskFlow API is running...',
  version: '1.0.0'
}));

app.get('/', (req, res) => res.json({
  success: true,
  message: 'TaskFlow API is running...',
  version: '1.0.0'
}));

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
