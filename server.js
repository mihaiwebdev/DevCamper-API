const path = require('path');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const colors = require('colors');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS atacks
app.use(xss());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    server.close(() => process.exit(1));
});