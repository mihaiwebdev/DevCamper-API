const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dontenv = require('dotenv');
const colors = require('colors');

// Load env file
dontenv.config({path:'./config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(path.join(`${__dirname}/_data/bootcamps.json`), 'utf-8'));
const courses = JSON.parse(fs.readFileSync(path.join(`${__dirname}/_data/courses.json`), 'utf-8'));

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);

        console.log('Data imported...'.green.inverse);
        process.exit();

    } catch (error) {
        console.error(error)
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        
        console.log('Data destroied...'.red.inverse);
        process.exit();

    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === '-i') {
    importData();

} else if (process.argv[2] === '-d') {
    deleteData();
};
