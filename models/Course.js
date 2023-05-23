const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description :{
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add a number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scolarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {

    const averageCostObj = await this.aggregate([
        // Stage 1: Filter courses by bootcamp id
        {
            $match: { bootcamp: bootcampId }
        },
        // Stage 2: Group remaining courses by bootcamp id and calculate the average of their tuition
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition'}
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(averageCostObj[0].averageCost / 10) * 10
        });

    } catch (error) {
        console.log(error);
    }
};

CourseSchema.post('save', async function() {
    this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('deleteOne', { document: true }, async function(next) {
    this.constructor.getAverageCost(this.bootcamp);
    next();
});

module.exports = mongoose.model('Course', CourseSchema);