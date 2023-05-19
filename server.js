const express = require('express');
require('dotenv').config({path: './config/config.env'});
const PORT = process.env.PORT;

const app = express();

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))