const express = require('express');
const morgan = require('morgan');
require('dotenv').config({path: './config/config.env'});

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Morgan middleware
app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT;


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))